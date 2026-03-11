import { DiagnosticItem } from '../types';

export const diagnosticItems: DiagnosticItem[] = [
  // Bloque A - Fase 1
  {
    id: 'diag_a1',
    block: 'A',
    context: 'Laura lleva diez años trabajando como médica en el Hospital Italiano. Cuando la presentan a alguien, dice: "Hola,',
    blankBefore: '',
    blankAfter: 'médica."',
    options: ['soy', 'estoy'],
    correctOption: 'soy'
  },
  {
    id: 'diag_a2',
    block: 'A',
    context: 'Los estudiantes llegaron al aula pero el profesor todavía no apareció. Alguien pregunta dónde está y otro dice: "No sé, creo que',
    blankBefore: '',
    blankAfter: 'en la sala de profesores."',
    options: ['es', 'está'],
    correctOption: 'está'
  },
  {
    id: 'diag_a3',
    block: 'A',
    context: 'En la panadería, después de pedir medialunas, el cliente pregunta el precio. El vendedor responde: "',
    blankBefore: '',
    blankAfter: 'doscientos pesos."',
    options: ['Son', 'Están'],
    correctOption: 'Son'
  },
  {
    id: 'diag_a4',
    block: 'A',
    context: 'Después de caminar todo el día por la ciudad, llegamos al hotel. Me siento en la cama y digo: "',
    blankBefore: '',
    blankAfter: 'agotada."',
    options: ['Soy', 'Estoy'],
    correctOption: 'Estoy'
  },
  
  // Bloque B - Fase 2
  {
    id: 'diag_b1',
    block: 'B',
    context: 'Todos en la empresa coinciden: desde que entró, siempre llega puntual, ayuda a sus compañeros y nunca se queja.',
    blankBefore: '',
    blankAfter: 'una persona muy generosa.',
    options: ['Es', 'Está'],
    correctOption: 'Es'
  },
  {
    id: 'diag_b2',
    block: 'B',
    context: 'Rodrigo acaba de hacer tres horas de entrenamiento. Cuando llega a casa se tira en el sillón. Su hermana le pregunta cómo está y él dice: "',
    blankBefore: '',
    blankAfter: 'destrozado."',
    options: ['Soy', 'Estoy'],
    correctOption: 'Estoy'
  },
  {
    id: 'diag_b3',
    block: 'B',
    context: 'Mi abuelo jugó al básquet toda su vida. Ahora tiene 80 años pero todavía se nota su altura.',
    blankBefore: '',
    blankAfter: 'muy alto.',
    options: ['Es', 'Está'],
    correctOption: 'Es'
  },
  {
    id: 'diag_b4',
    block: 'B',
    context: 'La cocina quedó un desastre después de la fiesta de anoche. Nadie limpió nada todavía.',
    blankBefore: 'La cocina',
    blankAfter: 'muy sucia.',
    options: ['es', 'está'],
    correctOption: 'está'
  },

  // Bloque C - Fase 3
  {
    id: 'diag_c1',
    block: 'C',
    context: 'Marcos terminó de estudiar para el parcial y no sabe qué hacer. Se sienta en el sillón mirando el techo.',
    blankBefore: 'Marcos',
    blankAfter: 'aburrido.',
    options: ['es', 'está'],
    correctOption: 'está'
  },
  {
    id: 'diag_c2',
    block: 'C',
    context: 'En todas las reuniones, Marcos habla siempre de lo mismo, nunca escucha y termina durmiéndose. Sus compañeros lo evitan.',
    blankBefore: 'Marcos',
    blankAfter: 'aburrido.',
    options: ['es', 'está'],
    correctOption: 'es'
  },
  {
    id: 'diag_c3',
    block: 'C',
    context: 'Esa película de terror me dio muchísimo miedo. No pude dormir en toda la noche.',
    blankBefore: 'Yo',
    blankAfter: 'muy nervioso.',
    options: ['soy', 'estoy'],
    correctOption: 'estoy'
  },
  {
    id: 'diag_c4',
    block: 'C',
    context: 'Mi hermano no puede tomar café porque le altera mucho el pulso y se altera por cualquier cosa.',
    blankBefore: 'Él',
    blankAfter: 'una persona muy nerviosa.',
    options: ['es', 'está'],
    correctOption: 'es'
  }
];
