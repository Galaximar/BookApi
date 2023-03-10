# API REST - Venta de libros

Para levantar el proyecto, se debe tener instalado PostgreSQL,NodeJS.
Instalar dependencias con el comando npm install

Agregar variables de entorno en el archivo .env

- DATABASE_URL="postgresql://postgres:<contraseña de postgres>@<host>:<puerto>/postgres"
- JWT="Clave secreta usada para el token de logeo, puede ser cualquier string"
- Ejecutar npx prisma migrate dev, dentro de la carpeta src para así guardar datos en la base de datos
- Ejecutar npm start para correr el proyecto

# Peticiones <b>GET</b>

    Obtener productos: /products

##

    Obtener carrito: /cart

- Requiere token de autenticación (Bearer token) en el header.

# Peticiones <b>POST</b>

    Crear un producto: /products

- Body: <b>name</b> (string), <b>isbn</b>(string), <b>price</b>(number,float), <b>author</b>(string), <b>editorial</b>(string), <b>stock</b>(number,int >=0).
- Requiere token de autenticación (Bearer token) en el header.

Ejemplo:

```json
{
  "name": "El Aleph",
  "isbn": "9780307950782",
  "price": 10.99,
  "author": "Jorge Luis Borges",
  "editorial": "Debolsillo",
  "stock": 50
}
```

    Registro de ingreso de producto: /products/inventory

- Body: { distribuitor, products: [{ isbn, stock }] }.
- Si el producto ya existe, actualiza el stock y si no lo crea.
- Requiere token de autenticación (Bearer token) en el header.

Ejemplo:

```json
{
  "distribuitor": "Distribuidora XYZ",
  "products": [
    {
      "isbn": "9780307950782",
      "stock": 10
    },
    {
      "isbn": "9780307950812",
      "stock": 5
    }
  ]
}
```

    Registro de usuario: /user/register

- Body: <b>name</b>, <b>email</b>, <b>password</b>.
- La contraseña es hasheada para mayor seguridad cuando se guarda en la base de datos.
- Se pide un email de tipo válido.

Ejemplo:

```json
{
  "name": "Juan Pérez",
  "email": "juanperez@gmail.com",
  "password": "123456"
}
```

    Logeo de usuario: /user/login

- Body: <b>email</b>, <b>password</b>.
- Genera un token de autenticación (Bearer token) que se utiliza en rutas como crear inventario, crear productos, agregar a carrito, obtener carrito, comprar carrito y editar usuario.

Ejemplo:

```json
{
  "email": "juanperez@gmail.com",
  "password": "123456"
}
```

    Agregar o crear carrito: /cart

- Body: { products: [{ id, quantity }] }.
- No se permite agregar más productos de los que hay en stock.
- Si el carrito está creado, agrega productos a el (o actualiza un cart item) y si no lo crea
- Requiere token de autenticación (Bearer token) en el header.

Ejemplo:

```json
{
  "products": [
    {
      "id": "50ac6c3f-ac8e-4c07-a75d-19a472dbf30d",
      "quantity": 2
    },
    {
      "id": "3f11fbda-4f12-4de8-8dab-d0c3f61883bd",
      "quantity": 1
    }
  ]
}
```

    Comprar el carrito: /cart/buy

- Body: <b>cartId</b>(uuid).
- Actualiza el stock del producto y en caso de que exceda el stock se avisa al usuario de esto y la compra se cancela.
- Requiere token de autenticación (Bearer token) en el header.

# Peticiones <b>PUT</b>

    Editar un usuario: /user/edit

- Body: <b>photo</b>(string), <b>address</b>(string).
- Requiere token de autenticación (Bearer token) en el header.

##

     Actualizar stock de productos: /products

- Body: <b>stock</b> (number,int),<b>id</b>(uuid).
- Requiere token de autenticación (Bearer token) en el header.

# Seguridad

- Se implemento JWT para la generación de tokens y bcryptjs para el hash de contraseñas.
- Permisos en ciertas rutas solo válido para usuarios logeados.
- Se procuro que no existan productos con stock no válidos.
- Verificación de stock válido cuando se realiza la compra.
- Verificación sobre el planteamiento de si se agrega un producto al inventario que ya existía.
