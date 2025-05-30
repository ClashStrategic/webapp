<?php
$dirs = [
    // images files
    'static/media/cards/iconCards',
    'static/media/cards/towerCards',
    /* '../static/media/emotes', */
    /* '../static/media/icons', */
    /* '../static/media/styles/user/banners', */
    /* '../static/media/anuncios/CS', */
    /* '../static/media/styles', */
    'static/media/styles/audio',
    /* '../static/media/styles/cofres', */
    'static/media/styles/icons/card_stat_inf',
    /* '../static/media/styles/img_index', */
    /* '../static/media/styles/infjug', */
    'static/media/styles/logo',
    /* '../static/media/styles/menu', */
    'static/media/styles/icons/menu_opc',
    'static/media/styles/modal',
    /* '../static/media/styles/notificacion', */
    /* '../static/media/styles/reacciones', */
    /* '../static/media/styles/redes_sociales' */

    // css files
    'src/css/base',
    'src/css/objects',
    'src/css/skins',

    // js files
    'src/js/config',
    'src/js/events',
    // 'src/js/libraries',
    'src/js/models',
    'src/js/tools',
    'src/js/utilsjs'
];

$allFiles = [];
$ExtencionesPermitidas = ['jpg', 'webp', 'png', 'gif', 'mp3', 'js', 'css', 'html'];

try {
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) {
            echo json_encode(array('error' => 'El directorio ' . $dir . ' no existe.'), JSON_FORCE_OBJECT);
            break;
        }

        $files = array_diff(scandir($dir), array('.', '..'));
        $files = array_filter($files, function ($file) use ($dir, $ExtencionesPermitidas) {
            $filePath = $dir . '/' . $file;
            $extension = pathinfo($filePath, PATHINFO_EXTENSION);
            return in_array(strtolower($extension), $ExtencionesPermitidas);
        });
        $files = array_map(function ($file) use ($dir) {
            return $dir . '/' . $file;
        }, $files);

        $allFiles = array_merge($allFiles, $files);
    }

    $totalSizeInBytes = array_sum(array_map('filesize', $allFiles));
    $totalSizeInMb = $totalSizeInBytes / (1024 * 1024);
    $dataToSend = ['allFiles' => $allFiles, 'sizeAll' => $totalSizeInMb];
    echo json_encode($dataToSend, JSON_FORCE_OBJECT);
} catch (Exception $e) {
    echo json_encode(array('error' => $e->getMessage()), JSON_FORCE_OBJECT);
}
