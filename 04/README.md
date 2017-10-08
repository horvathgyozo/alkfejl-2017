# 4. gyakorlat: Szerveroldali Java: REST API, jogosultságvizsgálat

## Table of contents:

- User API
    + register / login végpontok (az előző óráról)
    + user adat lekérése
    + munkamenet
- Issue API
    + entity
    + 1-N kapcsolat a userrel
    + issue-k lekérdezése
    + authorizáció
    + többi végpont elkészítése
- Feladat: Messages API
- git használat





- User entity, UserRepository, UserService, UserController
- POST /api/user/register: sima save, return user
- POST /api/user/login: isValid, find -> user, return user
- Ha nincs, akkor null / Exception
- GET /api/user: fake adatokkal
- SessionScope

- issue
- issue-user, oda-vissza hivatkozás (elég csak issue->user)
- issuerepository, issueservice, issueapicontroller
- GET /api/issue: mindent visszaadni (service: repo.findAll())
- végtelen rekurzió megoldása
    + kétirányú hivatkozás megszüntetése
    + JsonIgnore
    + JsonIgnoreProperties
- Authorizáció
    + annotáció
    + interceptor
    + regisztrlás
    + használat
- Többi végpont elkészítése


