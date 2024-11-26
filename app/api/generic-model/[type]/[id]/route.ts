// File: app/api/generic-model/[type]/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { modelConfigs, ModelType, ModelConfig } from '@/server/model-config';
import { processChangedFormDataFiles } from '@/server/utils/filehandler';

async function handleRequest(
  request: NextRequest,
  params: { type: ModelType; id: number },
  action: (config: ModelConfig<any>, id: number, token: string) => Promise<any>
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, id } = params;
    const config = modelConfigs[type];

    if (!config) {
      return NextResponse.json(
        { error: 'Invalid model type' },
        { status: 400 }
      );
    }

    const result = await action(config, id, session.user.apiUserToken);
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Unable to connect to the database. Please try again later.' },
        { status: 503 } // Service Unavailable
      );
    }

    if (error.response?.status === 401) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (error.message === 'Model not found') {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        error:
          error.message ||
          `An error occurred while processing the ${params.type}`
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { type: ModelType; id: number } }
) {
  return handleRequest(request, params, async (config, id, token) => {
    const model = await config.getFunction(id, token);
    if (!model) {
      throw new Error('Model not found');
    }
    return {
      message: `${
        params.type.charAt(0).toUpperCase() + params.type.slice(1)
      } retrieved successfully`,
      model,
      ok: true
    };
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { type: ModelType; id: number } }
) {
  return handleRequest(request, params, async (config, id, token) => {
    await config.deleteFunction(id, token);
    return {
      message: `${
        params.type.charAt(0).toUpperCase() + params.type.slice(1)
      } deleted successfully`,
      ok: true
    };
  });
}

function handleSocialInteraction(existingModel: any, formData: FormData) {
  const socialInteractionType = formData.get('socialInteractionType') as string;
  const data = JSON.parse(formData.get('data') as string);

  switch (socialInteractionType) {
    case 'comment':
      if (data.action === 'remove') {
        return {
          ...existingModel,
          comments: (existingModel.comments || []).filter(
            (comment: any) => comment.id !== data.commentId
          )
        };
      }
      return {
        ...existingModel,
        comments: [...(existingModel.comments || []), data]
      };

    case 'like':
      return {
        ...existingModel,
        likes:
          data.action === 'add'
            ? [...(existingModel.likes || []), data.like]
            : (existingModel.likes || []).filter(
                (like: any) => like.userId !== data.like.userId
              )
      };

    case 'share':
      return {
        ...existingModel,
        shares: [...(existingModel.shares || []), data]
      };

    default:
      throw new Error('Invalid social interaction type');
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { type: ModelType; id: number } }
) {
  return handleRequest(request, params, async (config, id, token) => {
    const session = await auth();

    // Parse the incoming request as FormData
    const formData = await request.formData();
    const existingModel = await config.getFunction(id, token);

    if (!existingModel) {
      throw new Error('Model not found');
    }

    try {
      let updatedData: any = {};

      if (formData.has('socialInteractionType')) {
        // Handle social interactions
        updatedData = handleSocialInteraction(existingModel, formData);
      } else {
        // Handle file uploads and other form data
        const fileChangeIndicators = Array.from(formData.entries()).filter(
          ([key, value]) =>
            key.endsWith('file_change_indicator') && value === 'no'
        );

        const processedFormData = await processChangedFormDataFiles(
          formData,
          params.type,
          session
        );

        updatedData = config.fromFormData(processedFormData);

        fileChangeIndicators.forEach(([key]) => {
          const fieldName = key.replace('_file_change_indicator', '');
          delete updatedData[fieldName];
        });
      }

      if (params.type === 'user_Profile') {
        updatedData.user_id = session?.user.id;
      }

      const updatedModel = await config.updateFunction(id, updatedData, token);

      if (!updatedModel) {
        throw new Error('Failed to update model');
      }

      return {
        message: `${
          params.type.charAt(0).toUpperCase() + params.type.slice(1)
        } updated successfully`,
        model: updatedModel,
        ok: true
      };
    } catch (error) {
      console.error('Error in PUT method:', error);
      throw error;
    }
  });
}
