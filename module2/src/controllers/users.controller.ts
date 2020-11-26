import { Request, Response } from 'express';
import { Controller } from '../definitions/controller.abstract';
import HttpException from '../exceptions/HttpException';
import { ValidatedRequest } from 'express-joi-validation';
import { UsersRequestSchema, userBodySchema, limitQuerySchema, substringParamSchema } from '../validators/users.validator';
import UsersService from '../services/users.service';
import { coreValidator, headersSchema, idParamSchema } from '../validators/core.validator';
import { CONTENT_TYPE, CONTENT_TYPE_APP_JSON } from '../definitions/constants';
import UserGroupService from '../services/userGroup.service';
import { controllerErrorLogger } from '../../../utils/consoleUtils';
import authMiddleware from '../middlewares/auth.middleware';

class UsersController extends Controller {
  constructor() {
    super('/users');
  }

  initRoutes() {
    const { router, path } = this;
    router.use(path, authMiddleware);
    router.get(path, this.getAllUsers.bind(this));
    router.get(
      `${path}/:id`,
      coreValidator.params(idParamSchema),
      this.getUserById.bind(this)
    );
    router.post(
      path,
      coreValidator.headers(headersSchema),
      coreValidator.body(userBodySchema),
      this.addUser.bind(this)
    );
    router.put(
      `${path}/:id`,
      coreValidator.headers(headersSchema),
      coreValidator.params(idParamSchema),
      coreValidator.body(userBodySchema),
      this.updateUser.bind(this)
    );
    router.delete(
      `${path}/:id`,
      coreValidator.params(idParamSchema),
      this.softDeleteUser.bind(this)
    );
    router.get(
      `${path}/suggest/:substr`,
      coreValidator.params(substringParamSchema),
      coreValidator.query(limitQuerySchema),
      this.getAutoSuggestUsers.bind(this)
    )
  }

/**
 * @swagger
 *
 * /users:
 *   get:
 *     tags: 
 *       - "users-controller"
 *     description: Get all users
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         $ref: '#components/responses/listUser'
 */
  getAllUsers(req: Request, res: Response): void {
    UsersService.findAll()
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'No user found!');
        } else {
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(err.status).send(err.message);
        controllerErrorLogger(UsersService.findAll.name, [], err);
      });
  }

/**
 * @swagger
 *
 * /users/{userId}:
 *   get:
 *     tags:
 *       - "users-controller"
 *     description: "Get a user by id"
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *        $ref: '#/components/responses/successUser'
 */
  getUserById(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    UsersService.findOneById(userId)
      .then((result) => {
        if (!result) {
          throw new HttpException(404, 'User not found!');
        } else {
          res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(err.status).send(err.message);
        controllerErrorLogger(UsersService.findOneById.name, [userId], err);
      });
  }

/**
 * @swagger
 *
 * /users:
 *   post:
 *     tags:
 *       - "users-controller"
 *     description: "Create a user"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       $ref: '#/components/requestBodies/userBody'
 *     responses:
 *       200:
 *        $ref: '#/components/responses/successUser'
 */
  addUser(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    UsersService.addOne(req.body)
      .then((result) => {
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(418).send(err);
        controllerErrorLogger(UsersService.addOne.name, [req.body], err);
      });
  }

/**
 * @swagger
 *
 * /users/{userId}:
 *   put:
 *     tags:
 *       - "users-controller"
 *     description: "Update a user"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       $ref: '#/components/requestBodies/userBody'
 *     responses:
 *       200:
 *        $ref: '#/components/responses/listUser'
 */
  updateUser(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    UsersService.updateOne(userId, req.body)
      .then((result) => {
        if(!result[0]) {
          throw new HttpException(404, 'User not found!');
        }
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json(result[1]);
      })
      .catch((err) => {
        res.status(err.status).send(err.message);
        controllerErrorLogger(UsersService.updateOne.name, [userId, req.body], err);
      });
  }

/**
 * @swagger
 *
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - "users-controller"
 *     description: "Soft-delete a user"
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *        $ref: '#/components/responses/deleteUser'
 */
  softDeleteUser(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const userId: string = req.params.id;
    Promise.all(([
      UsersService.updateOne(userId, { isDeleted: true }),
      UserGroupService.removeAllById(userId, true),
    ]))
      .then(([
        [updatedUserCount, updatedUserEntity],
        userGroupRemovalCount
      ]) => {
        if (!updatedUserCount) {
          throw new HttpException(404, 'User not found!');
        }
        res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
        res.status(200).json({
          updatedUserEntity,
          userGroupRemovalCount,
        });
      })
      .catch((err) => {
        res.status(err.status || 404).send(err.message || err);
        controllerErrorLogger(UsersService.updateOne.name, [userId, { isDeleted: true }], err);
        controllerErrorLogger(UserGroupService.removeAllById.name, [userId, true], err);
      });
  }

/**
 * @swagger
 *
 * users/suggest/{substr}:
 *   get:
 *     tags:
 *       - "users-controller"
 *     description: "Auto-suggest users by substring and limit"
 *     produces:
 *       - application/json
 *     parameters:
 *       - $ref: '#/components/parameters/substring'
 *       - $ref: '#/components/parameters/suggestionLimit'
 *     responses:
 *       200:
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  login:
 *                    type: string
 */
  getAutoSuggestUsers(req: ValidatedRequest<UsersRequestSchema>, res: Response): void {
    const substring: string = req.params.substr;
    const limit: number = req.query.limit;

    UsersService.autoSuggestUsers(substring, limit)
      .then((result) => {
        if (!result.length) {
          res.setHeader(CONTENT_TYPE, 'text/html');
          res.sendStatus(204);
        } else {
          res.setHeader(CONTENT_TYPE, CONTENT_TYPE_APP_JSON);
          res.status(200).json(result);
        }
      })
      .catch((err) => {
        res.status(err.status).send(err.message);
        controllerErrorLogger(UsersService.autoSuggestUsers.name, [substring, limit], err);
      });
  }
}

export default  new UsersController() as UsersController;

/**
 * @swagger
 *
 * components:
 *  requestBodies:
 *     userBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: number
 *  parameters:
 *     substring:
 *       in: path
 *       name: substr
 *       description: Substring to search for amoung user names
 *       required: true
 *       schema:
 *         type: string
 *     suggestionLimit:
 *        in: query
 *        name: limit
 *        description: Limit number of suggested users
 *        required: false
 *        schema:
 *          type: number
 *          default: 5
 *  responses:
 *     successUser:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     listUser:
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/User'
 *     deleteUser:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updatedUserEntity:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/User'
 *               userGroupRemovalCount:
 *                 type: number
 */