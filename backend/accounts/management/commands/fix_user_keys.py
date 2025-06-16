from django.core.management.base import BaseCommand
from accounts.models import CustomUser
from utils.encryption import generate_and_encrypt_key

class Command(BaseCommand):
    help = "Génère une user_key sécurisée pour chaque utilisateur actif sans clé, avec clé vide ou clé invalide (ex : trop courte)."

    def handle(self, *args, **options):
        users = CustomUser.objects.filter(is_active=True)
        if users.count() == 0:
            self.stdout.write(self.style.WARNING(
                "Aucun utilisateur actif dans la base."
            ))
        else:
            to_update = []
            for user in users:
                if not user.user_key or len(user.user_key.strip()) < 40:
                    user.user_key = generate_and_encrypt_key()
                    user.save(update_fields=['user_key'])
                    to_update.append(user.email)
            if not to_update:
                self.stdout.write(self.style.SUCCESS(
                    "Tous les utilisateurs actifs possèdent déjà une user_key valide."
                ))
            else:
                self.stdout.write(self.style.SUCCESS(
                    f"{len(to_update)} utilisateurs actifs ont reçu une user_key générée avec succès :\n" +
                    ", ".join(to_update)
                ))
