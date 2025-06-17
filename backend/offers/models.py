from django.db import models

class Offer(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    nb_place = models.PositiveSmallIntegerField(default=1, help_text="Nombre de personnes incluses dans l'offre")

    def __str__(self):
        return self.name
