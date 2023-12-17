# Rutas

## Administradores

### Crear administrador

- POST: `/api/admins/`
- Body:

```json
{
  "nombre": "",
  "password": "",
  "correo": ""
}
```

- Devuelve:

```json
{
  "id": "",
  "nombre": "",
  "correo": ""
}
```

## Autenticación

### Iniciar sesión de administrador

- POST: `/api/auth/admins/`
- Body:

```json
{
  "correo": "",
  "password": ""
}
```

- Devuelve:

```json
{
  "id": "",
  "token": ""
}
```
