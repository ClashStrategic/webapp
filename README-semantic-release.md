# Semantic Release Configuration

Este proyecto utiliza **semantic-release** para automatizar el proceso de versionado y release. La configuración incluye un plugin personalizado que actualiza automáticamente el service worker.

## Configuración Actual

### Plugins Configurados (en orden de ejecución):

1. **@semantic-release/commit-analyzer** - Analiza los commits para determinar el tipo de release
2. **@semantic-release/release-notes-generator** - Genera las notas de release
3. **@semantic-release/npm** - Actualiza `package.json` y `package-lock.json` (sin publicar)
4. **@semantic-release/changelog** - Genera/actualiza el CHANGELOG.md
5. **./update-sw-version.js** - **Plugin personalizado** que actualiza el service worker
6. **@semantic-release/git** - Commitea los cambios de archivos
7. **@semantic-release/github** - Crea el release en GitHub

## Plugin Personalizado: update-sw-version.js

### Funcionalidad

El plugin personalizado `update-sw-version.js` actualiza automáticamente dos constantes en el archivo `sw.js`:

- **VERSION**: Se actualiza con la nueva versión del release
- **DATETIME**: Se actualiza con la fecha y hora actual en formato ISO

### Archivos Afectados

Durante un release, se actualizan automáticamente:

- `package.json` - Nueva versión
- `package-lock.json` - Nueva versión
- `sw.js` - Nueva VERSION y DATETIME
- `CHANGELOG.md` - Nuevas notas de release

### Ejemplo de Cambios en sw.js

**Antes del release:**
```javascript
const VERSION = '0.4.1';
const DATETIME = '2024-01-01T00:00:00.000Z';
```

**Después del release (ejemplo v1.2.3):**
```javascript
const VERSION = '1.2.3';
const DATETIME = '2025-05-26T14:08:27.271Z';
```

## Uso

### Commits Convencionales

Para que semantic-release funcione correctamente, usa commits convencionales:

```bash
# Para patch release (0.4.1 → 0.4.2)
git commit -m "fix: corrige problema en el cache del service worker"

# Para minor release (0.4.1 → 0.5.0)
git commit -m "feat: añade nueva funcionalidad de notificaciones"

# Para major release (0.4.1 → 1.0.0)
git commit -m "feat!: cambia API completamente"
# o
git commit -m "feat: nueva API

BREAKING CHANGE: La API anterior ya no es compatible"
```

### Ejecutar Release

```bash
# Release automático (en CI/CD)
npx semantic-release

# Release en modo dry-run (para probar)
npx semantic-release --dry-run
```

## Testing

Para probar el plugin personalizado:

```bash
node test-sw-update.js
```

Este script:
1. Simula un release con versión de prueba
2. Verifica que VERSION y DATETIME se actualicen correctamente
3. Restaura el contenido original

## Configuración de CI/CD

Asegúrate de tener configuradas las siguientes variables de entorno:

- `GITHUB_TOKEN` - Token de GitHub con permisos de escritura
- `NPM_TOKEN` - Token de npm (si planeas publicar)

## Troubleshooting

### El plugin no encuentra sw.js
- Verifica que el archivo `sw.js` existe en la raíz del proyecto
- Verifica que contiene las constantes `VERSION` y `DATETIME`

### Los cambios no se commitean
- Verifica que `sw.js` está incluido en los `assets` del plugin `@semantic-release/git`
- Verifica que no hay errores en el plugin personalizado

### El service worker no se actualiza en el navegador
- El service worker debería detectar automáticamente la nueva versión
- Verifica los logs del navegador para ver si se está instalando la nueva versión
- El DATETIME ayuda a identificar cuándo se compiló la versión actual
