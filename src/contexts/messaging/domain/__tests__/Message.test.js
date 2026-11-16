
import { describe, expect, test } from '@jest/globals';
import { Message } from '../Message.js';

describe('Message - Messaging Lía', () => {

  test('debe crear un mensaje válido', () => {
    const message = Message.create({
      id: 'msg-001',
      sender: 'EXPLORER',
      content: 'Hola Lía, recomiéndame un huarique'
    });

    expect(message.id).toBe('msg-001');
    expect(message.sender).toBe('EXPLORER');
    expect(message.content).toBe(
      'Hola Lía, recomiéndame un huarique'
    );
  });

  test('debe rechazar mensajes vacíos', () => {
    expect(() => {
      Message.create({
        id: 'msg-002',
        sender: 'EXPLORER',
        content: '   '
      });
    }).toThrow('El contenido del mensaje no puede estar vacío');
  });

  test('debe eliminar espacios y asignar valores por defecto', () => {
    const message = Message.create({
      id: 'msg-003',
      sender: 'LIA',
      content: '  Te recomiendo este huarique  '
    });

    expect(message.content).toBe(
      'Te recomiendo este huarique'
    );
    expect(message.detectedIntent).toBeNull();
    expect(message.reservationRef).toBeNull();
    expect(message.sentAt).toBeInstanceOf(Date);
  });

});
