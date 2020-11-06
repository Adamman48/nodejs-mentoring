import ModelInterface from "./core.interface";

type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface GroupInterface extends ModelInterface {
  name: string;
  permissions?: Permission[];
}

export default GroupInterface;
