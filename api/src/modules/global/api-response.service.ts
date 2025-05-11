import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiResponseService {
  success<T>(data: T, message: string = 'Operación exitosa', ...args: any[]) {
    const additionalData =
      args.length > 0 ? Object.assign({}, ...args) : undefined;

    return {
      ok: true,
      message,
      data: {
        ...data,
      },
      ...(additionalData || {}),
    };
  }

  error(message: string, errorDetails?: any, code: number = 400) {
    return {
      ok: false,
      message,
      error: {
        code,
        details: errorDetails,
      },
    };
  }
}

// return [
//     'id' => $this->id,
//     'type' => 'category',
//     'attributes' => [
//         'name' => $this->name,
//     ],
//     'relationships' => [
//         'recipes' => RecipeResource::collection($this->recipes) => 😁️ Recurso anidado            ]
// ];
