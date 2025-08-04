<?php

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Foundation\Configuration\Exceptions;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Http\Response;
return function (Exceptions $exceptions) {
    
    $exceptions->render(function (AuthorizationException|AccessDeniedHttpException $exception, $request) {
        return response()->json([
            'message' => 'No tienes permiso para acceder a este recurso.',
            'error' => 'Forbidden'
        ], Response::HTTP_FORBIDDEN);
    });

    $exceptions->render(function (AuthenticationException $exception, $request) {
        return response()->json([
            'message' => 'Inicia sesión para acceder a este recurso.',
            'error' => 'Unauthorized'
        ], Response::HTTP_UNAUTHORIZED);
    });



    $exceptions->render(function (ModelNotFoundException|NotFoundHttpException $exception, $request) {
        return response()->json([
            'message' => 'Recurso no encontrado.',
            'error' => 'Not Found'
        ], Response::HTTP_NOT_FOUND);
    });

    $exceptions->render(function (MethodNotAllowedHttpException $exception, $request) {
        return response()->json([
            'message' => 'Método no permitido.',
            'error' => 'Method Not Allowed'
        ], Response::HTTP_METHOD_NOT_ALLOWED);
    });

    $exceptions->render(function (ValidationException $exception, $request) {
        return response()->json([
            'message' => 'Error de validación.',
            'errors' => $exception->errors()
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    });

    $exceptions->render(function (Throwable $exception, $request) {
        return response()->json([
            'message' => 'Error interno del servidor.',
            'error' => $exception->getMessage(), 
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    });
    

};
