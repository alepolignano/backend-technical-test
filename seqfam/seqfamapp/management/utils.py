from django.db import connection
from seqfam.settings import DATABASES
import sqlite3

def get_page_and_freelist_count(apps, schema_editor):
    db_cur = connection.cursor()
    page_size = db_cur.execute("PRAGMA page_size;").fetchone()[0]
    page_count = db_cur.execute("PRAGMA page_count;").fetchone()[0]
    freelist_count = db_cur.execute("PRAGMA freelist_count;").fetchone()[0]
    print(f"\n\n DB size: {page_size * page_count/1024**2} MB, Freelist count: {freelist_count} \n --------")
    db_cur.close()
