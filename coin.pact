(module coin GOVERNANCE

  ; --------------------------------------------------------------------------
  ; Schemas and Tables

  (defschema coin-schema
    balance:decimal
    guard:guard)
  (deftable coin-table:{coin-schema})

  ; --------------------------------------------------------------------------
  ; Capabilities

  (defcap GOVERNANCE ()
    "upgrade disabled"
    false)

  (defcap TRANSFER ()
    "Autonomous capability to protect debit and credit actions"
    true)

  (defcap ACCOUNT_GUARD (account)
    "Lookup and enforce guards associated with an account"
    (with-read coin-table account { "guard" := g }
      (enforce-guard g)))

  (defcap GOVERNANCE ()
    (enforce false "Enforce non-upgradeability except in the case of a hard fork"))

  ; --------------------------------------------------------------------------
  ; Coin Contract

  (defun create-account:string (account:string guard:guard)
    (insert coin-table account
      { "balance" : 0.0
      , "guard"   : guard
      })
    )

  (defun fund-account:string (account:string guard:guard)
    @doc "give an account some coins for demo purposes"
    (with-capability (TRANSFER)
      (credit account guard 100000.0))
    )


  (defun account-balance:decimal (account:string)
    (with-read coin-table account
      { "balance" := balance }
      balance
      )
    )

  (defun transfer:string (sender:string receiver:string receiver-guard:guard amount:decimal)
    (with-capability (TRANSFER)
      (debit sender amount)
      (credit receiver receiver-guard amount))
    )

  (defun debit:string (account:string amount:decimal)
    @doc "Debit AMOUNT from ACCOUNT balance recording DATE and DATA"

    @model [(property (> amount 0.0))]
   ; (enforce (> amount 0.0) "AMOUNT must be positive")

    (require-capability (TRANSFER))
    (with-capability (ACCOUNT_GUARD account)
      (with-read coin-table account
        { "balance" := balance }

        (enforce (<= amount balance) "Insufficient funds")
        (update coin-table account
          { "balance" : (- balance amount) }
          )))
    )


  (defun credit:string (account:string guard:guard amount:decimal)
    @doc "Credit AMOUNT to ACCOUNT balance recording DATE and DATA"

    @model [(property (> amount 0.0))]
    ;(enforce (> amount 0.0) "AMOUNT must be positive")

    (require-capability (TRANSFER))
    (with-default-read coin-table account
      { "balance" : 0.0, "guard" : guard }
      { "balance" := balance, "guard" := retg }
      ; we don't want to overwrite an existing guard with the user-supplied one
      (enforce (= retg guard)
        "account guards do not match")

      (write coin-table account
        { "balance" : (+ balance amount)
        , "guard"   : retg
        })
      ))
)

(create-table coin-table)

;for demo purposes, make alice and bob accounts and give them some coins
(define-keyset 'alice-keyset (read-keyset "alice-keyset"))
(define-keyset 'bob-keyset (read-keyset "bob-keyset"))

(create-account 'alice 'alice-keyset)
(fund-account 'alice 'alice-keyset)

(create-account 'bob 'bob-keyset)
(fund-account 'bob 'bob-keyset)
