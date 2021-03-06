import { Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { controllerErrorLogger } from "../../../utils/consoleUtils";
import { Controller } from "../definitions/controller.abstract";
import authMiddleware from "../middlewares/auth.middleware";
import UserGroupService from "../services/userGroup.service";
import { coreValidator, idParamSchema, headersSchema } from "../validators/core.validator";
import { userGroupBodySchema, UserGroupRequestSchema } from "../validators/userGroup.validator";

class UserGroupController extends Controller {
  constructor() {
    super('/groups/add');
  }

  initRoutes() {
    const { router, path } = this;
    router.use(path, authMiddleware);
    router.put(
      `${path}/:id`,
      coreValidator.headers(headersSchema),
      coreValidator.params(idParamSchema),
      coreValidator.body(userGroupBodySchema),
      this.addUsersToGroup.bind(this)
    );
  }

/**
 * @swagger
 *
 * /groups/add/{groupId}:
 *   put:
 *     tags:
 *       - "groupUsers-controller"
 *     description: "Add n number of users to a group"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/groupIdParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/groupBody'
 *     responses:
 *       200:
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Users added to group!
 */
  addUsersToGroup(req: ValidatedRequest<UserGroupRequestSchema>, res: Response): void {
    const groupId: string = req.params.id;
    const { userIdList }: { userIdList: string[] } = req.body;

    UserGroupService.addUsersToGroup(userIdList, groupId)
      .then((result) => {
        res.status(200).send('Users added to group!');
      })
      .catch((err) => {
        res.status(404).send(err);
        controllerErrorLogger(UserGroupService.addUsersToGroup.name, [userIdList, groupId], err);
      });
  }
}

export default new UserGroupController() as UserGroupController;
