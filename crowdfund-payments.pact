;;
;; Simple crowdfunding account payments model.

;; define smart-contract code
(module uber-4-cats-crowdfund GOVERNANCE

;; remove ability to upgrade / modify contract
(defcap GOVERNANCE ()
  "upgrade disabled"
  false)

;; use coin.pact module for transactions
(use coin)
;; bless previous versions of module
;; (bless "ZHD9IZg-ro1wbx7dXi3Fr-CVmA-Pt71Ov9M1UNhzAkY")
  (defconst CROWDFUND_ACCOUNT:string 'crowdfund-account)
  (defconst CROWDFUND_DETAILS_KEY:string 'crowdfund-uber-4-cats)
  (defun crowdfund-guard:guard () (create-module-guard 'crowdfund-admin))

  (defschema crowdfund-details
    amount:decimal
    start-time:time
    funding-days:integer
    finalization-days:integer
    recepient-address:string)

    (defschema funders
      funded-amount:decimal)
  (deftable funders-table:{funders})
  (deftable crowdfund-details-table:{crowdfund-details})

  (defun crowdfund-details-config (amount:decimal funding-days:integer finalization-days:integer recepient-address:string)
    (insert crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "amount" : amount
      , "start-time": (time (read-msg "current-time"))
      , "funding-days": funding-days
      , "finalization-days": finalization-days
      , "recepient-address": recepient-address
      })
  )

  (defun in-funding-period ()
    (with-read crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "start-time" := start-time
      , "funding-days" := funding-days
      }
      (enforce (< (time (read-msg "current-time") (add-time start-time (days funding-days)))) "Funding Time Expired")
      ; add enforce it's not before start time because... blockchain
    )
  )

  (defun fund (payee:string funding-amount:decimal)
    (in-funding-period)
    (transfer payee CROWDFUND_ACCOUNT (crowdfund-guard) funding-amount)
    ; check to see if account already funded, else set default
    (with-default-read funders-table payee
      { "funded-amount" : 0.0 }
      { "funded-amount" := funded-amount }
      (write funders-table payee
        {"funded-amount" : (+ funded-amount funding-amount)})
    )
  )

  (defun finalize-fund (keyset:string)
    (with-read crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "start-time" := start-time
      , "funding-days" := funding-days
      , "finalization-days" := finalization-days
      , "amount" := amount
      , "recepient-address" := recepient-address
      }
      (enforce (> (time (read-msg "current-time") (add-time start-time (days funding-days)))) "Funding time has not yet expired")
      ;; add enforce it's not before start time because... blockchain
      (enforce (< (time (read-msg "current-time") (add-time start-time (days (+ funding-days finalization-days))))) "Finalization period has ended, refund period has begun")
      (enforce (>= (account-balance CROWDFUND_ACCOUNT) amount ) "Insufficient funding")
      ;; with-capability = for this portion of the stack allow ability to withdraw from crowdfund account
      (with-capability (crowdfund-guard)
        (transfer CROWDFUND_ACCOUNT recepient-address keyset amount)
      )
    )
  )

  (defun refund (keyset:string funder-account:string)
    (with-read crowdfund-details-table CROWDFUND_DETAILS_KEY
      { "start-time" := start-time
      , "funding-days" := funding-days
      , "finalization-days" := finalization-days
      }
      (enforce (> (time (read-msg "current-time") (add-time start-time (days (+ funding-days finalization-days))))) "Finalization period has ended, refund period has begun")
    )
    (with-read funders-table funder-account
      {"funded-amount" := funded-amount}
      (with-capability (crowdfund-guard)
              (transfer CROWDFUND_ACCOUNT funder-account keyset funded-amount)
            )
      (update funders-table funder-account {"funded-amount": 0})
    )
  )
)

(coin.create-account CROWDFUND_ACCOUNT (crowdfund-guard))
(coin.create-account 'grumpy-cat-llc 'grumpy-cat-llc-keyset)
(create-table crowdfund-details-table)
(create-table funders-table)
(crowdfund-details-config 1000.00 7 1 'grumpy-cat-llc)
