import * as React from 'react'; 
import { createRoot } from 'react-dom/client'; 

import '../src/assets/style.css'; 

async function addSticky() {
  const stickyNote = await miro.board.createStickyNote({
      content: 'Hello, World!', 
  }); 
  
  await miro.board.viewport.zoomTo(stickyNote); 
} 
async function getObjectProperties() {
  let selectedItems = await miro.board.getSelection();
  const objectJSON = JSON.stringify(selectedItems, null, 2);
  
  const textJSON = await miro.board.createText({
    content: objectJSON,
    style: {
      color: '#1a1a1a', // Default value: '#1a1a1a' (black)
      fillColor: 'transparent', // Default value: transparent (no fill)
      fillOpacity: 1, // Default value: 1 (solid color)
      fontFamily: 'arial', // Default font type for the text
      fontSize: 14, // Default font size for the text
      textAlign: 'left', // Default horizontal alignment for the text
    },
    x: 0, // Default value: horizontal center of the board
    y: 0, // Default value: vertical center of the board
    width: 300,
    rotation: 0.0,
  });
  
   await miro.board.viewport.zoomTo(textJSON); 
} 

function diasDesde(fechaIni) {
  // Convertimos la fecha de entrada a un objeto Date
  const startDate = new Date(fechaIni);
  
  // Obtenemos la fecha de hoy
  const today = new Date();
  
  // Calculamos la diferencia en milisegundos
  const diffDate = today - startDate;
  
  // Convertimos la diferencia a días
  const diffDays = Math.floor(diffDate / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
function calculaColor(cycletime) {

    if (cycletime == 0 ) {
        return "#FFFFFF";
    }  
    else if (cycletime >= 1 && cycletime <= 5) {
        return "#8FD14F";
    } else if (cycletime >= 6 && cycletime <= 10) {
        return "#FAC710";
    } else if (cycletime > 10) {
        return "#F05656";
    } else {
        return "#484848"; // Opcional, para manejar números negativos o no válidos
    }
 
}


async function copyDate() {
      // Get selected items
      let selectedItems = await miro.board.getSelection();
      let onlyCards = selectedItems.filter(element => element.type === 'card');

      // Mostramos una alerta por cada objeto filtrado
      onlyCards.forEach(onlyCards => {

         
        const cardX = onlyCards.x;
        const cardY = onlyCards.y;
        let cycletime; // Declaramos cycletime fuera del bloque if
        if (onlyCards.startDate !== undefined && onlyCards.startDate !== null) {
            cycletime = diasDesde(onlyCards.startDate);
        } else {
            cycletime = "0"; // Asignamos "0" si no hay startDate
        }
        
         const cycletimeColor = calculaColor(cycletime);

         const shape = miro.board.createShape({
          content: String(cycletime),
          shape: 'circle',
          style: {
            color: '#1a1a1a', // Default text color: '#1a1a1a' (black)
            fillColor: cycletimeColor, // Default shape fill color: transparent (no fill)
            fontFamily: 'open_sans', // Default font type for the text
            fontSize: 37, // Default font size for the text, in dp
            textAlign: 'center', // Default horizontal alignment for the text
            textAlignVertical: 'middle', // Default vertical alignment for the text
            borderStyle: 'normal', // Default border line style
            borderOpacity: 1.0, // Default border color opacity: no opacity
            borderColor: 'transparent', // Default border color: '#ffffff` (white)
            borderWidth: 2, // Default border width
            fillOpacity: 1.0, // Default fill color opacity: no opacity
          },
          x: cardX - 320, // Default value: center of the board
          y: cardY, // Default value: center of the board
          width: 77,
          height: 77,
        });
        
        /*let tagName = `Card ID: ${onlyCards.id}`; // Usar el ID de la card para crear el nombre del tag
        miro.board.tags.create({
            title: tagName, // Título del tag que queremos asignar
            color: 'green', // Color del tag
            objectIds: [shape.id], // Asignar el tag al shape usando su ID
        });*/




        //miro.board.viewport.zoomTo(shape); 

         /*miro.board.createStickyNote({
          content: onlyCards.title + '  ' + cycletime, 
        });*/  
       
      });
      
      
  
  
} 

// Función para buscar o crear un tag
async function findOrCreateTag(tagName) {
  // Obtener los tags existentes en el board
  let tags = await miro.board.tags.get();

  // Buscar si ya existe un tag con el nombre dado
  let existingTag = tags.find(tag => tag.title === tagName);

  // Si existe, retornarlo; si no, crearlo
  if (existingTag) {
      return existingTag;
  } else {
      // Crear el tag si no existe
      let newTag = await miro.board.tags.create({ title: tagName, color: 'green' });
      return newTag;
  }
}

const App = () => {
    React.useEffect(() => {
        //addSticky(); 
    }, []); 
    
    return ( <div className="grid wrapper"> 

      <div className="cs1 ce12"> 
        <button className="button button-primary" type="button" onClick={addSticky}>
          Hello world sticky!
        </button>
      </div> 
      <div className="cs1 ce12"> 
        <button className="button button-primary" type="button" onClick={copyDate}>
          Calcular Cycletime
        </button>
      </div> 
      <div className="cs1 ce12"> 
        <button className="button button-primary" type="button" onClick={getObjectProperties}>
          Obtener propiedades del objeto
        </button>
      </div> 
    </div> ); 
}; 

const container = document.getElementById('root'); 
const root = createRoot(container); 
root.render(<App />); 
