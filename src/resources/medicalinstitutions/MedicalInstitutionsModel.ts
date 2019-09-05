import { MedicalInstitutions } from "@golemio/schema-definitions";
import { GeoJsonModel } from "../../core/models";

export class MedicalInstitutionsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(MedicalInstitutions.name,
            MedicalInstitutions.outputMongooseSchemaObject,
            MedicalInstitutions.mongoCollectionName);

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }

    public GetTypes = async () => {
        const types = {
            health_care: [
                "Fakultní nemocnice",
                "Nemocnice",
                "Ostatní ambulantní zařízení",
                "Ostatní zdravotnická zařízení",
                "Zdravotní záchranná služba",
                "Zdravotnické středisko",
            ],
            pharmacies: [
                "Nemocniční lékárna s odbornými pracovišti",
                "Lékárna",
                "Lékárna s odbornými pracovišti",
                "Výdejna",
                "Vojenská lékárna",
                "Vojenská lékárna s OOVL",
                "Nemocniční lékárna",
                "Lékárna s odbornými pracovišti s OOVL",
                "Nemocniční lékárna s OOVL",
                "Nemocniční lékárna s odbor. pracovišti s OOVL",
                "Odloučené oddělení výdeje léčivých přípravků",
                "Lékárna s OOVL",
                "Lékárna s odborným pracovištěm, která zásobuje lůžková zdravotnická zařízení",
                "Lékárna s odborným pracovištěm, která zásobuje lůžková zdravotnická zařízení s OOVL",
                "Lékárna zásobujicí zařízení ústavní péče",
                "Lékárna zásobujicí zařízení ústavní péče s OOVL",
            ],
        };

        return types;
    }
}
