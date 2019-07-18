(defpact payment (payer payer-entity payee payee-entity amount date)
  "Debit PAYER at PAYER-ENTITY then credit PAYEE at PAYEE-ENTITY for AMOUNT on DATE"
  (step-with-rollback payer-entity
    (debit payer amount date
          { "payee": payee
          , "payee-entity": payee-entity
          , PACT_REF: (pact-id)
          })
    (credit payer amount date
         { PACT_REF: (pact-id), "note": "rollback" }))

  (step payee-entity
    (credit payee amount date
          { "payer": payer
          , "payer-entity": payer-entity
          , PACT_REF: (pact-id)
          }
    )))
