import { Connection, Node } from "@/generated/prisma/browser"
import toposort from "toposort"

export const topologicalSort = (
    nodes: Node[],
    connections: Connection[]
) : Node[] => {
    // If no connections, return node as-is (they`re all independent)
    if(connections.length === 0){
        return nodes
    }

    // Create edges array for toposort
    const edges: [string, string][] = connections.map((conn) => [
        conn.fromNodeId,
        conn.toNodeId
    ])

    // Might Be Buggy - PR: 18
    // Add nodes with no connections as self-edges to ensure they`re included
    const connectedNodeIds = new Set<string>()
    for(const conn of connections){
        connectedNodeIds.add(conn.fromNodeId)
        connectedNodeIds.add(conn.toNodeId)
    }

    for(const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id, node.id])
        }
    }

    // Better Way - Code Rabbit
    // Track nodes that participate in edges
    // const connectedNodeIds = new Set<string>()
    // for (const conn of connections) {
    //     connectedNodeIds.add(conn.fromNodeId)
    //     connectedNodeIds.add(conn.toNodeId)
    // }
    // const isolatedNodeIds = nodes
    //     .filter((node) => !connectedNodeIds.has(node.id))
    //     .map((node) => node.id)


    // Perform topological sort
    let sortedNodeIds: string[]
    try {
        // Might Give Error - PR 18
        sortedNodeIds = toposort(edges)
        // Remove Duplicates (from self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)]

        // Better Way - Code Rabbit
        // sortedNodeIds = toposort(edges)
        // sortedNodeIds = [...new Set(sortedNodeIds)]
        // const sortedSet = new Set(sortedNodeIds)
        // sortedNodeIds = [
        //     ...sortedNodeIds,
        //     ...isolatedNodeIds.filter((id) => !sortedSet.has(id))
        // ]
    }
    catch (error){
        if(error instanceof Error && error.message.includes("Cyclic")){
            throw new Error("Workflow contains a cycle")
        }
        throw error
    }

    // Map Sorted IDs back to node objects
    const nodeMap = new Map(nodes.map((n) => [n.id, n]))
    
    return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean)
}