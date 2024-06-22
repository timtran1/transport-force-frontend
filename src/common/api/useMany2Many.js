import useModel from "./useModel.jsx";
import {useState} from "react";
import useAuthentication from "./useAuthentication.js";
import BackendHostURLState from "../stores/BackendHostURLState.js";

export default function useMany2Many(
    {
        thisRecord: initialThisRecord,
        junctionModel,
        thisForeignKeyField,
        thatForeignKeyField,
        relationshipName
    }
) {
    const {
        create: createJunction,
        del: deleteJunction,
        loading,
        error
    } = useModel(junctionModel)
    const {user} = useAuthentication()
    const [thisRecord, setThisRecord] = useState(initialThisRecord)
    const {backendHost} = BackendHostURLState(state => state)

    async function create(newRecords, currentRecord = thisRecord) {
        return Promise.all(newRecords.map(record => createJunction({
            [thisForeignKeyField]: currentRecord.id,
            [thatForeignKeyField]: record.id
        })))
    }

    async function update(newRecords, currentRecord = thisRecord) {
        const oldRecords = currentRecord[relationshipName]
        const oldRecordIds = oldRecords.map(record => record.id)
        const newRecordIds = newRecords.map(record => record.id)

        const recordsToAdd = newRecords.filter(record => !oldRecordIds.includes(record.id))
        const recordsToRemove = oldRecords.filter(record => !newRecordIds.includes(record.id))

        const created = create(recordsToAdd, currentRecord)

        if (!recordsToRemove.length) return created

        // search for junctions records to delete
        const headers = {'Content-Type': 'application/json'}
        if (user?.token) headers.Authorization = `Bearer ${user.token}`
        const res = await fetch(`${backendHost}/${junctionModel}/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                search: {
                    AND: [
                        {
                            field: thisForeignKeyField,
                            operator: '=',
                            value: currentRecord.id
                        },
                        {
                            field: thatForeignKeyField,
                            operator: 'in',
                            value: recordsToRemove.map(record => record.id)
                        }
                    ]
                }
            })
        })
        const data = await res.json()
        const junctionRecordsToRemove = data.data
        const deleted = Promise.all(junctionRecordsToRemove.map(record => deleteJunction(record.id)))

        return Promise.all([created, deleted])
    }

    async function del(recordsToRemove) {
        return Promise.all(recordsToRemove.map(record => deleteJunction(record.id)))
    }

    return {
        create,
        update,
        del,
        loading,
        error,
        thisRecord, setThisRecord
    }
}