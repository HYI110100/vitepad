import { PORT_RANGE } from "~/config";
import { CreateCommand } from "~/types/commands";
import { ServiceItem } from "~/types/storage";
import JSONStorage from "~/utils/storage";
import { collectAndParseTarget, findAvailablePort, getRootDir, uuid } from "~/utils/utils";


const ServiceStorage = new JSONStorage<{ [key: string]: ServiceItem }>(getRootDir('data_service.json'))
export const initServiceStorage = async () => {
    await ServiceStorage.init()
}
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
export async function getServices(){
    return Object.values(ServiceStorage.get())
}
