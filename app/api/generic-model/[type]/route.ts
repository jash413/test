// File: app/api/generic-model/[type]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { modelConfigs, ModelType } from '@/server/model-config';
import { handleFileUpload } from '@/server/utils/filehandler';

export async function POST(
  request: NextRequest,
  { params }: { params: { type: ModelType } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = params;
    const config = modelConfigs[type];

    if (!config) {
      return NextResponse.json(
        { error: 'Invalid model type' },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // console.log('project documents :', formData.get('project_documents'));
    await handleFileUpload(formData, session, type);
    // console.log('file_info:', file_info);
    // if (file_info.length) {
    //   formData.delete('file_info');
    //   formData.append('file_info', JSON.stringify(file_info));
    // }

    if (session.user.business_info && type !== 'inspiration')
      formData.append('business_id', session.user.business_info.business_id);

    const inputData = config.fromFormData(formData);
    const inputModel = {
      ...inputData,
      [config.idField]: session.user.id
    };

    // console.log('updatedModel', inputModel);
    const createdModel = await config.upsertFunction(
      inputModel,
      session.user.apiUserToken
    );

    if (!createdModel) {
      return NextResponse.json(
        { error: 'Failed to create model' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } created successfully`,
      model: createdModel,
      ok: true
    });
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

    return NextResponse.json(
      {
        error:
          error.message || `An error occurred while creating the ${params.type}`
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { type: ModelType } }
) {
  try {
    console.log('GET params:', params);

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = params;

    console.log('type:', type);

    const config = modelConfigs[type];

    console.log('config :', config);

    if (!config) {
      return NextResponse.json(
        { error: 'Invalid model type' },
        { status: 400 }
      );
    }

    // passing params to listFunction

    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    console.log('filter', queryParams);

    const models = await config.listFunction(
      queryParams,
      session.user.apiUserToken
    );
    return NextResponse.json({ models });
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

    return NextResponse.json(
      {
        error:
          error.message || `An error occurred while fetching the ${params.type}`
      },
      { status: 500 }
    );
  }
}
