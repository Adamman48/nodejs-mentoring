import ModelInterface from "./core.interface";

interface UserInterface extends ModelInterface {
  login?: string;
  password?: string;
  age?: number;
  isDeleted?: boolean;
}

export default UserInterface;
