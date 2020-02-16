# Express Drills
This is a set of drills to explore the capabilities of Express.js. It is for Thinkful's Node curriculum.

----------

## Installation

```language
npm install
npm start
```

Server will load on http://localhost:8000/

----------

## Endpoints
- ## `/sum`
    - Params:
      - **a** = integer
      - **b** = integer
     - Returns the sum of **a + b**
     - Example call:
        - `http://localhost:8000/sum?a=5&b=8`
- ## `/cipher`
    - Params:
      - **text** = string
      - **shift** = integer
     - Returns a Caesar Cipher of **text** shifted by **shift** value
     - Supports negative integers and all special characters.
       - Note: Make sure you are passing in a `URIEncoded` string if using spaces or special characters
     - Example call:
        - `http://localhost:8000/cipher?text=This%20is%20a%20cipher`
- ## `/lotto`
    - Params:
      - **numbers** = [ int, int, int, int, int, int ]
      - Requires 6 numbers
        - Note: To make an array, simply pass in multiple `numbers` as params
        - ie. `numbers=2&numbers=4&numbers=5&numbers=12&numbers=19&numbers=20`
     - Creates 6 unique random numbers between 1 - 20 as winning numbers
     - Returns info about how many of your numbers were correct
     - Example call:
        - `http://localhost:8000/lotto?number=1&number=2&number=3&number=4&number=5&number=6`
