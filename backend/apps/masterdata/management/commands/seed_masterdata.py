from django.core.management.base import BaseCommand
from apps.masterdata.seed_master import seed_all

class Command(BaseCommand):
    help = 'Seeds the MongoDB master database with all 19 collections (real-world data)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--drop',
            action='store_true',
            help='Drop existing collections and re-seed from scratch',
        )

    def handle(self, *args, **options):
        drop = options.get('drop', False)
        self.stdout.write(self.style.NOTICE(f"Starting master database seed (drop_existing={drop})..."))
        results = seed_all(drop_existing=drop, verbose=True)
        self.stdout.write(self.style.SUCCESS("Master database seed completed!"))
