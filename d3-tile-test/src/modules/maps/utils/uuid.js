//@flow
import uuidV1 from 'uuid/v1';

export const uuidGenerator = ():string =>{
    return uuidV1();
}