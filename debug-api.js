// Script de diagnóstico para probar la API
const fs = require('fs');
const path = require('path');

// Función para crear un archivo de prueba
function createTestFile() {
    const content = 'Este es un documento de prueba para diagnosticar el problema de namespace.\n\nContenido importante:\n- Información relevante para consultas\n- Datos de ejemplo\n- Texto para buscar';
    const filename = 'test-document.txt';
    fs.writeFileSync(filename, content);
    return filename;
}

// Función para probar upload
async function testUpload() {
    console.log('🔍 Probando upload...');
    
    const filename = createTestFile();
    const FormData = require('form-data');
    const fetch = require('node-fetch');
    
    const form = new FormData();
    form.append('file', fs.createReadStream(filename));
    
    try {
        const response = await fetch('http://localhost:3000/api/upload', {
            method: 'POST',
            body: form
        });
        
        const result = await response.json();
        console.log('📤 Respuesta del upload:', JSON.stringify(result, null, 2));
        
        // Limpiar archivo temporal
        fs.unlinkSync(filename);
        
        return result.file_id || result.namespace || result.documentId;
    } catch (error) {
        console.error('❌ Error en upload:', error.message);
        return null;
    }
}

// Función para probar query
async function testQuery(fileId) {
    console.log('\n🔍 Probando query con file_id:', fileId);
    
    if (!fileId) {
        console.log('❌ No hay file_id para probar query');
        return;
    }
    
    const fetch = require('node-fetch');
    
    try {
        const response = await fetch('http://localhost:3000/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                query: '¿Cuál es el contenido del documento?', 
                file_id: fileId 
            })
        });
        
        const result = await response.json();
        console.log('💬 Respuesta de la query:', JSON.stringify(result, null, 2));
        
    } catch (error) {
        console.error('❌ Error en query:', error.message);
    }
}

// Ejecutar diagnóstico
async function runDiagnostic() {
    console.log('🚀 Iniciando diagnóstico de API\n');
    
    const fileId = await testUpload();
    await testQuery(fileId);
    
    console.log('\n✅ Diagnóstico completado');
}

runDiagnostic();

