import { Router } from 'express';
import type { Model } from 'mongoose';

export function createCrudRouter(model: Model<any>, populateFields: string[] = []) {
  const router = Router();

  router.get('/', async (_request, response) => {
    try {
      let query = model.find();
      for (const field of populateFields) {
        query = query.populate(field);
      }
      response.json(await query.sort({ createdAt: -1 }));
    } catch (error) {
      response.status(500).json({ error: getErrorMessage(error) });
    }
  });

  router.get('/:id', async (request, response) => {
    try {
      let query = model.findById(request.params.id);
      for (const field of populateFields) {
        query = query.populate(field);
      }
      const document = await query;
      if (!document) {
        response.status(404).json({ error: 'Resource not found' });
        return;
      }
      response.json(document);
    } catch (error) {
      response.status(400).json({ error: getErrorMessage(error) });
    }
  });

  router.post('/', async (request, response) => {
    try {
      const document = await model.create(request.body);
      response.status(201).json(document);
    } catch (error) {
      response.status(400).json({ error: getErrorMessage(error) });
    }
  });

  router.patch('/:id', async (request, response) => {
    try {
      const document = await model.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true,
      });
      if (!document) {
        response.status(404).json({ error: 'Resource not found' });
        return;
      }
      response.json(document);
    } catch (error) {
      response.status(400).json({ error: getErrorMessage(error) });
    }
  });

  router.delete('/:id', async (request, response) => {
    try {
      const document = await model.findByIdAndDelete(request.params.id);
      if (!document) {
        response.status(404).json({ error: 'Resource not found' });
        return;
      }
      response.status(204).send();
    } catch (error) {
      response.status(400).json({ error: getErrorMessage(error) });
    }
  });

  return router;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unexpected server error';
}