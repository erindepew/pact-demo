;;
;; Simple crowdfunding account payments model.
;; (define-keyset 'grumpy-cat-llc-keyset (read-keyset "grumpy-cat-llc-keyset"))
;; define smart-contract code
(module uber-4-cats-crowdfund GOVERNANCE

;; remove ability to upgrade / modify contract
(defcap GOVERNANCE ()
  "upgrade disabled"
  false)

;; using coin.pact module for transactions
  (use coin)
;; declare constants for accounts, keys, and guards
  (defconst CROWDFUND_ACCOUNT:string 'crowdfund-account)
  (defconst CROWDFUND_DETAILS_KEY:string 'crowdfund-uber-4-cats)
  (defun crowdfund-guard:guard () (create-module-guard 'crowdfund-admin))

;; define schemas for tables
  (defschema crowdfund-details
    amount:decimal
    start-time:time
    funding-days:integer
    finalization-days:integer
    recepient-address:string)

    (defschema funders
      funded-amount:decimal)

  ;; define tables
  (deftable funders-table:{funders})
  (deftable crowdfund-details-table:{crowdfund-details})

;; set configuration for this crowdfund project
  (defun crowdfund-details-config (amount:decimal funding-days:integer finalization-days:integer recepient-address:string)
    (insert crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "amount" : amount
      , "start-time": (time (read-msg "current-time"))
      , "funding-days": funding-days
      , "finalization-days": finalization-days
      , "recepient-address": recepient-address
      })
  )

;; helper function to determine if it is within the funding period
  (defun in-funding-period ()
    (with-read crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "start-time" := start-time
      , "funding-days" := funding-days
      }
      (enforce (< (time (read-msg "current-time") (add-time start-time (days funding-days)))) "Funding Time Expired")
      ; TODO add enforce it's not before start time because... blockchain
    )
  )

;; fund crowdfund project
  (defun fund (payee:string funding-amount:decimal)
    ;; enforce that it's within the funding period
    (in-funding-period)
    ;; enforce that it's a non-negative and non-zero amount
    (enforce (> funding-amount 0) "Funding amount must not be negative or zero")
    (transfer payee CROWDFUND_ACCOUNT (crowdfund-guard) funding-amount)
    ; check to see if account already funded, else set default
    (with-default-read funders-table payee
      { "funded-amount" : 0.0 }
      { "funded-amount" := funded-amount }
      (write funders-table payee
        {"funded-amount" : (+ funded-amount funding-amount)})
    )
  )

;; payout to "fundee" if the crowdfund project is successfully completed
  (defun finalize-fund (keyset:string)
    (with-read crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "start-time" := start-time
      , "funding-days" := funding-days
      , "finalization-days" := finalization-days
      , "amount" := amount
      , "recepient-address" := recepient-address
      }
      ;; enforce that it's within payout window
      (enforce (> (time (read-msg "current-time") (add-time start-time (days funding-days)))) "Funding time has not yet expired")
      ;; TODO add enforce it's not before start time because... blockchain
      ;; enforce end of finalization period
      (enforce (< (time (read-msg "current-time") (add-time start-time (days (+ funding-days finalization-days))))) "Finalization period has ended, refund period has begun")
      ;; enforce that project has sufficient funding
      (enforce (>= (account-balance CROWDFUND_ACCOUNT) amount ) "Insufficient funding")
      ;; with-capability = for this portion of the stack allow ability to withdraw from crowdfund account
      (with-capability (crowdfund-guard)
        (transfer CROWDFUND_ACCOUNT recepient-address keyset amount)
      )
    )
  )

;; refund "funders" if crowdfund project is not completed
;; each user will have to call this individually
  (defun refund (keyset:string funder-account:string)
    (with-read crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "start-time" := start-time
      , "funding-days" := funding-days
      , "finalization-days" := finalization-days
      }
      ;; enforce that refund period has begun
      (enforce (> (time (read-msg "current-time") (add-time start-time (days (+ funding-days finalization-days))))) "Finalization period has ended, refund period has begun")
    )
    ;; refund "funder" the amount that they donated to the project
    (with-read funders-table funder-account
      {"funded-amount" := funded-amount}
      ;; enforce that they have a non-zero and non-negative amount to refund
      (enforce (> funded-amount 0) "Cannot refund a zero or negative amount")
      ;; with-capability = for this portion of the stack allow ability to withdraw from crowdfund account
      (with-capability (crowdfund-guard)
              (transfer CROWDFUND_ACCOUNT funder-account keyset funded-amount)
            )
      ;; set value to 0 in funders table to prevent double-dipping
      (update funders-table funder-account {"funded-amount": 0})
    )
  )
)

(coin.create-account CROWDFUND_ACCOUNT (crowdfund-guard))
;; TODO require at least one of keyset to allow for multiple keys

(create-table crowdfund-details-table)
(create-table funders-table)
(crowdfund-details-config 1000.00 7 1 'grumpy-cat-llc)
