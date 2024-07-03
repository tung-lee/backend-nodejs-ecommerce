import lodash from "lodash";

// just get some fields from object
const getInfoData = ({
  fields = [],
  object = {},
}: {
  fields: string[];
  object: object;
}) => {
  return lodash.pick(object, fields);
};

export { getInfoData };
