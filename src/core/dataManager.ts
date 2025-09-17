import { PORT_RANGE } from "~/config";
import { CreateCommand } from "~/types/commands";
import { ServiceItem } from "~/types/storage";
import JSONStorage from "~/utils/storage";
import { collectAndParseTarget, findAvailablePort, getRootDir, uuid } from "~/utils/utils";

const ServiceStorage = new JSONStorage<{ [key: string]: ServiceItem }>(getRootDir('data_service.json'))
// 增
export async function createService(params: CreateCommand) {
    try {
        const name = params.name.trim()
        if (name && !name.length) {
            throw '服务名称不能为空！'
        }
        const existName = Object.values(ServiceStorage.get()).some(x => x.name === name)
        if (existName) {
            throw '服务名称已存在！'
        }
        if (!params.port) {
            throw '服务端口不能为空！'
        }
        const port = findAvailablePort(params.port, Object.values(ServiceStorage.get()).map(x => x.port), PORT_RANGE)
        const item: ServiceItem = {
            id: uuid(8, 's_'),
            name,
            port,
            createdAt: new Date(),
            updatedAt: new Date()
        }
        if (params.dir && params.dir.trim().length) {
            item.dir = params.dir
        }
        if (params.proxy && params.proxy.length) {
            item.proxies = params.proxy!.map(x => collectAndParseTarget(x))
        }
        if (params.viteConfig && params.viteConfig.trim().length) {
            item.viteConfig = params.viteConfig
        }
        if (params.dist && params.dist.trim().length) {
            item.dist = params.dist
        }
        ServiceStorage.set(item.id, item)
        await ServiceStorage.save()
        return item
    } catch (error) {
        throw error
    }
}
// 删
export async function deleteService(services: ServiceItem[]) {
    try {
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            await ServiceStorage.delete(service.id)
        }

        await ServiceStorage.save()
    } catch (error) {
        throw error
    }
}
export async function deleteServiceByName(data: (string[]) | string) {

    const names = Array.isArray(data) ? data : [data];
    const services = Object.values(ServiceStorage.get());
    const targetServices = services.filter(service => names.includes(service.name));

    if (targetServices.length === 0) {
        throw '未找到指定的服务！';
    }

    await deleteService(targetServices);
    return targetServices;
}

export async function deleteServiceByID(data: (string[]) | string) {

    const ids = Array.isArray(data) ? data : [data];
    const services = Object.values(ServiceStorage.get());
    const targetServices = services.filter(service => ids.includes(service.id));

    if (targetServices.length === 0) {
        throw '未找到指定的服务！';
    }

    await deleteService(targetServices);
    return targetServices;
}
export async function deleteServiceAll() {
    try {
        ServiceStorage.clear()
        await ServiceStorage.save()
    } catch (error) {
        throw error
    }
}
// 查
export function getServicesAll() {
    return Object.values(ServiceStorage.get())
}
// export function getServicesByID(ID: string) {
//     if(!ID){
//         throw new Error('服务ID不能为空')
//     }
//     const service = ServiceStorage.get(ID)
//     if(!service){
//         throw new Error('服务不存在')
//     }
//     return service
// }
// export function getServicesByName(name: string) {
//     if(!name){
//         throw new Error('服务名称不能为空')
//     }
//     const ID = Object.values(ServiceStorage.get()).find(x => x.name === name)?.id
//     if(!ID){
//         throw new Error('服务不存在')
//     }
//     return ServiceStorage.get(ID)
// }
// 改
// 其他
export const initServiceStorage = async () => {
    await ServiceStorage.init()
}
export const getSize = () => {
    return ServiceStorage.size()
}

