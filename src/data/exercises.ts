import { Exercise } from '../types';

export const exercises: Exercise[] = [
  // Phase 1 & 2 - Discrimination
  {
    id: 'd1',
    phase: 1,
    type: 'discrimination',
    context: 'Sofía llegó al trabajo después de dormir mal. Le cuesta concentrarse y se equivoca en cosas simples.',
    sentence: 'Sofía está distraída hoy.',
    options: [
      { id: 'a', text: 'Sofía tiene una personalidad distraída.', isCorrect: false },
      { id: 'b', text: 'Sofía está distraída en este momento.', isCorrect: true }
    ],
    explanation: 'En este caso el hablante está hablando de cómo está Sofía ahora, en esta situación. Por eso usamos estar.'
  },
  {
    id: 'd2',
    phase: 1,
    type: 'discrimination',
    sentence: 'Mi coche es rojo.',
    options: [
      { id: 'a', text: 'Es una propiedad del coche.', isCorrect: true },
      { id: 'b', text: 'Es un estado temporal del coche.', isCorrect: false }
    ],
    explanation: 'Usamos "ser" para presentar el color como una propiedad inherente del individuo (el coche), independiente del momento.'
  },
  {
    id: 'd3',
    phase: 2,
    type: 'discrimination',
    sentence: 'Juan está muy alto.',
    options: [
      { id: 'a', text: 'Juan siempre fue una persona alta.', isCorrect: false },
      { id: 'b', text: 'Juan ha crecido recientemente (sorpresa/cambio).', isCorrect: true }
    ],
    explanation: 'Aunque "alto" suele ir con "ser", usar "estar" aquí ancla la altura a una situación reciente, expresando sorpresa por un cambio o desarrollo.'
  },
  {
    id: 'd4',
    phase: 1,
    type: 'discrimination',
    context: 'Hablando sobre el trabajo de alguien:',
    sentence: 'Soy profesora de español en Buenos Aires.',
    options: [
      { id: 'a', text: 'Es una clasificación de mi identidad profesional.', isCorrect: true },
      { id: 'b', text: 'Es un estado temporal en el que me encuentro.', isCorrect: false }
    ],
    explanation: 'Las profesiones se presentan como una propiedad o clasificación del individuo, por lo tanto usamos "ser".'
  },
  {
    id: 'd5',
    phase: 1,
    type: 'discrimination',
    context: 'Buscando a los niños en la casa:',
    sentence: 'Los chicos están en el patio.',
    options: [
      { id: 'a', text: 'Es una característica de los chicos.', isCorrect: false },
      { id: 'b', text: 'Es la localización física en este momento.', isCorrect: true }
    ],
    explanation: 'Para la localización física de personas o cosas, usamos "estar" porque ancla la entidad a unas coordenadas espaciales en una situación.'
  },
  // Phase 1 & 2 - Classification
  {
    id: 'c1',
    phase: 1,
    type: 'classification',
    sentences: [
      { id: 's1', text: 'El cielo es azul.', category: 'propiedad' },
      { id: 's2', text: 'El cielo está nublado.', category: 'estado' },
      { id: 's3', text: 'Mi hermano es alto.', category: 'propiedad' },
      { id: 's4', text: 'Mi hermano está cansado.', category: 'estado' }
    ],
    explanation: 'Las propiedades (ser) describen cómo es algo normalmente. Los estados (estar) describen cómo se encuentra algo en una situación específica.'
  },
  {
    id: 'c2',
    phase: 2,
    type: 'classification',
    sentences: [
      { id: 's1', text: 'La puerta es de madera.', category: 'propiedad' },
      { id: 's2', text: 'La puerta está abierta.', category: 'estado' },
      { id: 's3', text: 'El café es de Colombia.', category: 'propiedad' },
      { id: 's4', text: 'El café está frío.', category: 'estado' }
    ],
    explanation: 'El material y el origen son propiedades inherentes (ser). Estar abierta o frío son estados anclados a este momento (estar).'
  },
  // Phase 1 & 2 - Minimal Pairs
  {
    id: 'm1',
    phase: 1,
    type: 'minimal_pairs',
    context: 'Hablando de la ubicación de un edificio:',
    blankBefore: 'El museo',
    blankAfter: 'en el centro de la ciudad.',
    options: ['es', 'está'],
    correctOption: 'está',
    explanation: 'Para ubicaciones físicas (dónde está algo), siempre usamos "estar", anclando la entidad a unas coordenadas espaciales.'
  },
  {
    id: 'm2',
    phase: 2,
    type: 'minimal_pairs',
    context: 'Describiendo la personalidad de tu amigo:',
    blankBefore: 'Mi amigo',
    blankAfter: 'muy inteligente y curioso.',
    options: ['es', 'está'],
    correctOption: 'es',
    explanation: 'La inteligencia se presenta como una propiedad del individuo (ILP), no como un estado temporal.'
  },
  {
    id: 'm3',
    phase: 2,
    type: 'minimal_pairs',
    context: 'Después de correr una maratón:',
    blankBefore: 'María',
    blankAfter: 'muy cansada.',
    options: ['es', 'está'],
    correctOption: 'está',
    explanation: 'El cansancio es un estado físico anclado a la situación (después de correr), del cual María puede salir (SLP).'
  },
  {
    id: 'm3b',
    phase: 2,
    type: 'minimal_pairs',
    context: 'Hablando sobre una amiga que espera un bebé:',
    blankBefore: 'Ana',
    blankAfter: 'embarazada de seis meses.',
    options: ['es', 'está'],
    correctOption: 'está',
    explanation: 'Aunque el embarazo dura nueve meses, el hablante lo presenta como un estado anclado a una situación con fecha de fin visible, no como una propiedad inherente.'
  },
  // Phase 3 - Ambivalent (B1 alto)
  {
    id: 'm4',
    phase: 3,
    type: 'minimal_pairs',
    context: 'Esta película no tiene acción y la trama es lenta.',
    blankBefore: 'La película',
    blankAfter: 'muy aburrida.',
    options: ['es', 'está'],
    correctOption: 'es',
    explanation: '"Ser aburrido" significa que la cosa o persona produce aburrimiento (es una propiedad suya). "Estar aburrido" significa que siente aburrimiento (estado).'
  },
  {
    id: 'm5',
    phase: 3,
    type: 'minimal_pairs',
    context: 'No tengo nada que hacer hoy en casa.',
    blankBefore: 'Yo',
    blankAfter: 'muy aburrido.',
    options: ['soy', 'estoy'],
    correctOption: 'estoy',
    explanation: 'Aquí describes cómo te sientes en este momento (un estado), no tu personalidad.'
  },
  {
    id: 'm6',
    phase: 3,
    type: 'minimal_pairs',
    context: 'Hablando de la comida que preparaste:',
    blankBefore: '¡Qué',
    blankAfter: 'que está este asado!',
    options: ['rico', 'rica'],
    correctOption: 'rico',
    explanation: 'Estar rico significa que la comida tiene buen sabor.'
  },
  {
    id: 'm7',
    phase: 3,
    type: 'minimal_pairs',
    context: 'Ese chico tiene muchísimo dinero, compró tres casas.',
    blankBefore: 'Él',
    blankAfter: 'muy rico.',
    options: ['es', 'está'],
    correctOption: 'es',
    explanation: '"Ser rico" significa tener dinero (propiedad). "Estar rico" se usa para el sabor de la comida.'
  },
  // Fill in the blanks
  {
    id: 'f1',
    phase: 1,
    type: 'fill_in_blanks',
    textParts: ['Hola, yo ', ' de Argentina, pero ahora ', ' viviendo en Madrid. Mi departamento ', ' en el centro.'],
    blanks: [
      { id: 'b1', options: ['soy', 'estoy'], correctOption: 'soy' },
      { id: 'b2', options: ['soy', 'estoy'], correctOption: 'estoy' },
      { id: 'b3', options: ['es', 'está'], correctOption: 'está' }
    ],
    explanation: 'El origen (de Argentina) es una propiedad (ser). La acción en progreso (viviendo) y la ubicación física (en el centro) son estados o situaciones (estar).'
  },
  {
    id: 'f2',
    phase: 2,
    type: 'fill_in_blanks',
    textParts: ['Mi hermano ', ' muy inteligente, pero hoy ', ' muy cansado porque estudió toda la noche. La puerta de su cuarto ', ' cerrada.'],
    blanks: [
      { id: 'b1', options: ['es', 'está'], correctOption: 'es' },
      { id: 'b2', options: ['es', 'está'], correctOption: 'está' },
      { id: 'b3', options: ['es', 'está'], correctOption: 'está' }
    ],
    explanation: 'La inteligencia es una propiedad (ser). El cansancio y que la puerta esté cerrada son estados resultantes o temporales (estar).'
  },
  // Rioplatense specific
  {
    id: 'r1',
    phase: 4,
    type: 'minimal_pairs',
    context: 'Ves a una amiga que se arregló mucho para una fiesta (Uso mirativo/enfático):',
    blankBefore: '¡Qué linda que',
    blankAfter: 'hoy!',
    options: ['sos', 'estás'],
    correctOption: 'estás',
    rioplatenseOnly: true,
    explanation: 'En el español rioplatense, "estar" se usa frecuentemente con adjetivos de belleza para enfatizar el estado actual o mostrar sorpresa/admiración por cómo se ve alguien en ese momento específico.'
  },
  {
    id: 'r2',
    phase: 4,
    type: 'minimal_pairs',
    context: 'Alguien prueba una comida muy rica (Uso enfático):',
    blankBefore: '¡Qué rico que',
    blankAfter: 'este asado!',
    options: ['es', 'está'],
    correctOption: 'está',
    rioplatenseOnly: true,
    explanation: 'El uso de "estar" con "rico" para comida es común en general, pero en el Río de la Plata se exacerba el uso de "estar" para juicios subjetivos inmediatos sobre la experiencia sensorial.'
  }
];
