from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class PantryItem(models.Model):
    name = models.CharField(max_length=100)
    quantity = models.FloatField()
    unit = models.CharField(max_length=50)
    location = models.ForeignKey( "Location", 
        related_name="items", 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True   # <-- allows old rows to not have a location
    )
        
#Location, on_delete=models.CASCADE, related_name="items")


    def __str__(self):
        return f"{self.quantity} {self.unit} {self.name}({self.location})"

