export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

export const SIZE_WEIGHT = {
    XS: 2,
    S: 3,
    M: 4,
    L: 5,
    XL: 6,
    XXL: 7,
    '3XL': 8,
    '4XL': 9,
};

export const DELIVER_TYPES = [
    {
        id: '1',
        name: 'Przesyłka standardowa',
        deliverTime: { min: 5, max: 10 },
        price: 15,
    },
    {
        id: '2',
        name: 'Przesyłka premium',
        deliverTime: { min: 3, max: 5 },
        price: 30,
    },
    {
        id: '3',
        name: 'Przesyłka expresowa',
        deliverTime: { min: 2, max: 4 },
        price: 50,
    },
];

export const CLIENT_ID =
    '621775169522-e9i5tqri2o8t7u080qtti15vvabuemno.apps.googleusercontent.com';
