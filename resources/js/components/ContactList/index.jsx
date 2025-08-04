import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ContactList() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        axios.get('/api/contacts')
            .then(response => setContacts(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h2>Lista de Contactos</h2>
            <ul>
                {contacts.map(contact => (
                    <li key={contact.id}>
                        {contact.nombre} - {contact.telefono}
                    </li>
                ))}
            </ul>
        </div>
    );
}
