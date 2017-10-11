# 4. gyakorlat: Szerveroldali Java: REST API, jogosultságvizsgálat

## Tartalomjegyzék

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

## Példa kódtár

[Ebben](https://github.com/horvathgyozo/spring-boot-example) és [ebben](https://github.com/godzsa/issue-tracker/blob/master/README2.md) a kódtárban megtalálhatók az egyes lépések.

## Lépések

- User entity, UserRepository, UserService, UserApiController
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
    + regisztrálás
    + használat
- Többi végpont elkészítése

Az interceptor regisztrálását az alkalmazás főosztályában (`Application.java`) a következőképpen kell megtenni:

```java
@EntityScan("hello")
@SpringBootApplication
public class Application extends WebMvcConfigurerAdapter {

    @Autowired
    private HandlerInterceptor authInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor);
    }
    
    // ...
}
```

## Feladat

1. Minden issue-hoz tartozhat üzenet (message) is. Készítsd el az üzenetek kezelését szolgáló végpontot! Ld. a [kapcsolati modellt](https://github.com/godzsa/issue-tracker/blob/master/README2.md#model-kiegészítése) és a [végpont terveket]((https://github.com/godzsa/issue-tracker/blob/master/README2.md#message).