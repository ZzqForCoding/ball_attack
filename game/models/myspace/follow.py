from django.db import models

class Follow(models.Model):
    source = models.IntegerField(default=0)
    target = models.IntegerField(default=0)

    def __str__(self):
        return str(self.source) + ' - ' + str(self.target)