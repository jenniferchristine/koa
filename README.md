# Fullstack-utveckling med ramverk - Moment 2.2
> Av: Jennifer Jakobsson, jeja2306@student.miun.se

### Skapa REST-webbtjänst med backend-ramverk

*beskrivning*

Publicerad webbplats: [https://koa-moment2.netlify.app/]<br>
Publicerad webbtjänst: [https://koa-13bx.onrender.com/books/]

 #### Användning av databas:

<br>

| Metod | Ändpunkt | Beskrivning |
|-----------------|-----------------|-----------------|
| GET | /books | Hämtar alla sparade böcker |
| GET | /books/id | Hämtar specifik bok |
| POST | /books | Route för att lägga till bok |
| PUT | /books/id | Uppdaterar bok |
| DELETE | /books/id | Raderar bok |

<br>

### Ett objekt returneras/skickas som JSON med följande struktur:
#### /books:

```json
{
  "_id": ObjectId("66298100c0cfa4410c5346d1"),
  "title": "Alchemised",
  "publication": 2023,
  "read": true,
  "__v": 0
}
```