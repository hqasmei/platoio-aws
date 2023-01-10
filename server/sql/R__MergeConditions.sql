-- github.com/hqasmei/reflect/server/scripts/R__MergeConditions.sql
-- IMPORTANT: This migration does not specify a version, and is repeatable.
-- This migration will be run each time _any_ migrations are run, 
-- and will replace the function with the latest version.

-- PLPGSQL function to update reading-oob conditions, which are JSONB.
-- TODO: May want to revisit the merits of this approach.
-- Normalizing the data and using a separate table doesn't really seem better, 
-- but perhaps it is.
create or replace function jsonb_merge_conditions(currentData jsonb, newData jsonb)
returns jsonb as $$
declare
    currentCondition jsonb;
    newCondition jsonb;
begin
    raise notice 'Current conditions: %', currentData;
    raise notice 'New conditions: %', newData;
    for currentCondition in select * from jsonb_array_elements(currentData->'Conditions') loop
        for newCondition in select * from jsonb_array_elements(newData->'Conditions') loop
            if not currentCondition @> newCondition then
                raise notice 'New condition: %', newCondition;
                currentData = jsonb_insert(currentData, '{Conditions, 99999}', newCondition);
                raise notice 'Updated conditions: %', currentData;
            end if;
        end loop;
    end loop;
    raise notice 'Final conditions: %', currentData;
    return currentData;
end;
$$ language plpgsql;


