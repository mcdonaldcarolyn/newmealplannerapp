# mealplan/models.py
from django.db import models

class MealPlanItem(models.Model):
    name = models.CharField(max_length=200)
    date = models.DateField()
    recipe_id = models.IntegerField()   # Spoonacular recipe ID
    title = models.CharField(max_length=200)
    image = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.date}: {self.title}{self.name}"



