import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RoleCheckedGuard implements CanActivate{
    constructor(private reflector:Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req:Request=context.switchToHttp().getRequest();
        const role=req.token.role;

        const allowedToRoles=
                            this.reflector.
                            get<("administrator"|"user") []>('allow_to_roles',context.getHandler());

        if (!allowedToRoles.includes(role)) {
            throw new ForbiddenException('Access to this resource is forbidden');
        }     
        
        return true;
    }
   
}
/*
@Injectable()
export class RoleCheckedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    console.log('RoleCheckedGuard - Request Token:', req.token);
    console.log('RoleCheckedGuard - Request Headers:', req.headers);

    const role = req.token.role;
    const allowedToRoles = this.reflector.get<('administrator' | 'user')[]>('allow_to_roles', context.getHandler());

    if (!allowedToRoles.includes(role)) {
      throw new ForbiddenException('Access to this resource is forbidden');
    }

    return true;
  }
}

*/
