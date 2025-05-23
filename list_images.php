<?php
$dirs = [
    'Frontend/static/media/cards/iconCards',
    'Frontend/static/media/cards/towerCards',
    /* '../Frontend/static/media/emotes', */
    /* '../Frontend/static/media/icons', */
    /* '../Frontend/static/media/styles/user/banners', */
    /* '../Frontend/static/media/anuncios/CS', */
    /* '../Frontend/static/media/styles', */
    'Frontend/static/media/styles/audio',
    /* '../Frontend/static/media/styles/cofres', */
    'Frontend/static/media/styles/icons/card_stat_inf',
    /* '../Frontend/static/media/styles/img_index', */
    /* '../Frontend/static/media/styles/infjug', */
    'Frontend/static/media/styles/logo',
    /* '../Frontend/static/media/styles/menu', */
    'Frontend/static/media/styles/icons/menu_opc',
    'Frontend/static/media/styles/modal'
    /* '../Frontend/static/media/styles/notificacion', */
    /* '../Frontend/static/media/styles/reacciones', */
    /* '../Frontend/static/media/styles/redes_sociales' */
];

$allFiles = [];
$ExtencionesPermitidas = ['jpg', 'webp', 'png', 'gif', 'mp3'];

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
