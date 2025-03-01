from django.db import models

class OlympicEvent(models.Model):
    sport = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    description = models.TextField()
    date_time = models.DateTimeField()
    location = models.CharField(max_length=200)

    def __str__(self):
        return self.name
