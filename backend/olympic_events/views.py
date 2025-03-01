from django.http import JsonResponse

def events_list(request):
    # Sample data to be replaced with fixture data later
    events = [
        {
            "model": "olympic_events.olympic_event",
            "pk": 1,
            "fields": {
                "sport": "Basketball",
                "name": "Hommes, phase de groupe",
                "description": "groupe C, Jeu 19",
                "date_time": "2024-07-31T17:15:00Z",
                "location": "Stade Pierre Mauroy"
            }
        },
        {
            "model": "olympic_events.olympic_event",
            "pk": 2,
            "fields": {
                "sport": "Judo",
                "name": "-48 kg - fem., éliminatoire",
                "description": "1/16 finale, Concours 1",
                "date_time": "2024-07-27T10:00:00Z",
                "location": "Champ de Mars Arena"
            }
        },
    ]
    return JsonResponse(list(events), safe=False)  # safe=False to allow returning a list
