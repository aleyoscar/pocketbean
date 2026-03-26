from beancount import loader
from beancount.core import data
from pocketbase import PocketBase
from pathlib import Path
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# ========================= CONFIG FROM .env =========================
PB_URL = os.getenv("PB_URL", "http://127.0.0.1:8090")
PB_ADMIN_EMAIL = os.getenv("PB_ADMIN_EMAIL")
PB_ADMIN_PASSWORD = os.getenv("PB_ADMIN_PASSWORD")
BEANCOUNT_FILE = os.getenv("BEANCOUNT_FILE")

TARGET_USER_ID = os.getenv("TARGET_USER_ID")   # Optional

# Validation
if not PB_ADMIN_EMAIL or not PB_ADMIN_PASSWORD:
    raise ValueError("Missing PB_ADMIN_EMAIL or PB_ADMIN_PASSWORD in .env file")

if not BEANCOUNT_FILE:
    raise ValueError("Missing BEANCOUNT_FILE in .env file")

BEANCOUNT_FILE = Path(BEANCOUNT_FILE)

if not BEANCOUNT_FILE.exists():
    raise FileNotFoundError(f"Beancount file not found: {BEANCOUNT_FILE}")
# =========================================================

pb = PocketBase(PB_URL)
pb.admins.auth_with_password(PB_ADMIN_EMAIL, PB_ADMIN_PASSWORD)

print("Loading Beancount file...")
entries, errors, options = loader.load_file(str(BEANCOUNT_FILE))

if errors:
    print(f"Warnings/Errors while loading: {len(errors)}")

# Step 1: Build lookup maps
print("Building account and currency maps...")

account_map = {}   # name → id
currency_map = {}  # name → id

for curr in pb.collection('currencies').get_full_list():
    currency_map[curr.name] = curr.id

for acct in pb.collection('accounts').get_full_list():
    account_map[acct.name] = acct.id

print(f"Found {len(account_map)} accounts and {len(currency_map)} currencies.")

# Step 2: Import
print(f"Starting import of {sum(1 for e in entries if isinstance(e, data.Transaction))} transactions...")

imported = 0
created_accounts = 0
created_currencies = 0

for entry in entries:
    if not isinstance(entry, data.Transaction):
        continue

    try:
        # === Combine tags and links into one field ===
        combined_tags = []

        # Add regular tags (without #)
        for tag in (entry.tags or []):
            combined_tags.append(tag.strip())

        # Add links (without ^)
        for link in (entry.links or []):
            combined_tags.append(link.strip())

        # Create space-prefixed and suffixed string for safer querying
        tags_field = " " + " ".join(combined_tags) + " " if combined_tags else ""

        # Create Transaction
        tx_data = {
            "user": TARGET_USER_ID or pb.authStore.record.id,
            "date": entry.date.isoformat(),
            "flag": getattr(entry, 'flag', None) == "*",
            "payee": (entry.payee or "UNKNOWN").strip(),
            "notes": (entry.narration or "").strip(),
            "tags": tags_field,                    # ← Combined field with spaces
        }

        tx = pb.collection('transactions').create(tx_data)

        # Process and create Postings
        for i, posting in enumerate(entry.postings):
            if not posting.units or posting.units.number is None:
                continue

            amount = float(posting.units.number)
            currency_name = posting.units.currency or "USD"
            account_name = posting.account

            # Auto-create Currency if missing
            if currency_name not in currency_map:
                print(f"  → Creating currency: {currency_name}")
                curr_data = {
                    "user": TARGET_USER_ID or pb.authStore.record.id,
                    "name": currency_name,
                    "default": False
                }
                new_curr = pb.collection('currencies').create(curr_data)
                currency_map[currency_name] = new_curr.id
                created_currencies += 1

            # Auto-create Account if missing
            if account_name not in account_map:
                print(f"  → Creating account: {account_name}")
                acct_data = {
                    "user": TARGET_USER_ID or pb.authStore.record.id,
                    "name": account_name,
                    "currency": currency_map[currency_name]
                }
                new_acct = pb.collection('accounts').create(acct_data)
                account_map[account_name] = new_acct.id
                created_accounts += 1

            # Create Posting
            posting_data = {
                "user": TARGET_USER_ID or pb.authStore.record.id,
                "transaction": tx.id,
                "account": account_map[account_name],
                "amount": amount,
                "currency": currency_map[currency_name],
                "order": i
            }
            pb.collection('postings').create(posting_data)

        imported += 1
        if imported % 25 == 0:
            print(f"  → Imported {imported} transactions...")

    except Exception as e:
        print(f"Error on {entry.date} '{entry.payee or entry.narration}': {e}")

print("\n" + "="*70)
print("✅ IMPORT COMPLETED!")
print(f"   Transactions imported : {imported}")
print(f"   Accounts created      : {created_accounts}")
print(f"   Currencies created    : {created_currencies}")
print("="*70)
