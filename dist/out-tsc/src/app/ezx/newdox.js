import { Document, Paragraph, TextRun } from "docx";
export class DocumentCreator {
    // tslint:disable-next-line: typedef
    create() {
        const document = new Document();
        document.addSection({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun(j = 012, text, "จาก   ผปร.กวว.(น.2)	ถึง      หผ.ปบ.        ", bold, true, size, 32, font, {
                            name: "TH SarabunPSK",
                        })
                    ]
                }),
            ],
        }),
        ;
    }
    ;
}
return document;
//# sourceMappingURL=newdox.js.map