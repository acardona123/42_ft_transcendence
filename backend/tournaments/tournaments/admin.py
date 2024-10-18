from django.contrib import admin
from .models import Tournament, Participant

class TournmentsAdmin(admin.ModelAdmin):
	list_display = ('id', 'host', 'game', 'max_score', 'max_duration', 'status', 'max_match', 'next_match')

class ParticipantAdmin(admin.ModelAdmin):
	list_display = ('id', 'user', 'tournament', 'match', 'position', 'is_eliminated', 'is_playing')
admin.site.register(Tournament, TournmentsAdmin)
admin.site.register(Participant, ParticipantAdmin)
