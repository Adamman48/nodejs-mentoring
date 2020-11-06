import { Request, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { CONTENT_TYPE, CONTENT_TYPE_APP_JSON } from "../definitions/constants";
import { Controller } from "../definitions/controller.abstract";
import HttpException from "../exceptions/HttpException";
import GroupsService from "../services/groups.service";
import { coreValidator, headersSchema, idParamSchema } from "../validators/core.validator";
import { groupBodySchema, GroupsRequestSchema } from "../validators/groups.validator";

class GroupsController extends Controller {
  constructor() {
    super('/groups');
  }

  initRoutes() {
    const { router, path } = this;
    router.get(path, this.getAllGroups.bind(this));
    router.get(
      `${path}/:id`,
      coreValidator.params(idParamSchema),
      this.getGroupById.bind(this));
    router.post(
      path,
      coreValidator.headers(headersSchema),
      coreValidator.body(groupBodySchema),
      this.createGroup.bind(this)
    );
    router.put(
      `${path}/:id`,
      coreValidator.headers(headersSchema),
      coreValidator.params(idParamSchema),
      coreValidator.body(groupBodySchema),
      this.updateGroup.bind(this)
    );
    router.delete(
      `${path}/:id`,
      coreValidator.headers(headersSchema),
      coreValidator.params(idParamSchema),
      this.removeGroup.bind(this)
    );
  }

  getAllGroups(req: Request, res: Response): void {
    GroupsService.findAll()
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'No group found');
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  getGroupById(req: ValidatedRequest<GroupsRequestSchema>, res: Response): void {
    const groupId: string = req.params.id;
    GroupsService.findOneById(groupId)
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'No group found!');
        } else {
          res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
          res.status(200).json(result);
        }
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  createGroup(req: ValidatedRequest<GroupsRequestSchema>, res: Response): void {
    GroupsService.createOne(req.body)
      .then((result) => {
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result);
      })
      .catch((err) => res.status(418).send(err));
  }

  updateGroup(req: ValidatedRequest<GroupsRequestSchema>, res: Response): void {
    const groupId = req.params.id;
    GroupsService.updateOne(groupId, req.body)
      .then((result) => {
        if (!result[0]) {
          throw new HttpException(404, 'Group not found!');
        }
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result[1]);
      })
      .catch((err) => res.status(err.status).send(err.message));
  }

  removeGroup(req: ValidatedRequest<GroupsRequestSchema>, res: Response): void {
    const groupId = req.params.id;
    GroupsService.removeOne(groupId)
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'Group not found!');
        }
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result);
      })
      .catch((err) => res.status(err.status).send(err.message));
  }
}

export default new GroupsController() as GroupsController;
