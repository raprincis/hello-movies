*----------------------------------------------------------------------*
*       CLASS ZPRAXXCL_PERSONNES_RESOURCE DEFINITION
*----------------------------------------------------------------------*
*
*----------------------------------------------------------------------*
CLASS zpraxxcl_personnes_resource DEFINITION
  PUBLIC
  INHERITING FROM cl_rest_resource
  FINAL
  CREATE PUBLIC .

  PUBLIC SECTION.

    TYPES:
      BEGIN OF ty_s_personne,
        id  TYPE string,
        firstname TYPE string,
        lastname  TYPE string,
        birthdate TYPE string,
      END OF ty_s_personne,
       BEGIN OF ty_s_error,
        id  TYPE string,
        message TYPE string,
      END OF ty_s_error,
      ty_t_personne TYPE STANDARD TABLE OF ty_s_personne WITH DEFAULT KEY.

    METHODS constructor .

    METHODS if_rest_resource~get
      REDEFINITION .
    METHODS if_rest_resource~post
      REDEFINITION .
  PROTECTED SECTION.
  PRIVATE SECTION.

    DATA lt_personnes TYPE ty_t_personne .

    METHODS map_out_2_in
      IMPORTING
        value(is_out_personne) TYPE ty_s_personne
      RETURNING
        value(os_in_personne) TYPE zta_personne .
    METHODS map_in_2_out
      IMPORTING
        !is_in_personne TYPE zta_personne
      RETURNING
        value(os_out_personne) TYPE ty_s_personne .
    METHODS get_list_personnes
      RETURNING
        value(ot_list_personnes) TYPE ty_t_personne .
    METHODS create_personne
      IMPORTING
        !is_out_personne TYPE ty_s_personne
      RETURNING
        value(ov_personne_id) TYPE uuid
      RAISING
        cx_static_check .
    METHODS raise_exception
      IMPORTING
        !io_data TYPE any .
    METHODS get_personne_by_id
      IMPORTING
        !iv_personne_id TYPE string
      RETURNING
        value(os_out_personne) TYPE ty_s_personne
      RAISING
        cx_static_check .
ENDCLASS.



CLASS ZPRAXXCL_PERSONNES_RESOURCE IMPLEMENTATION.


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZPRAXXCL_PERSONNES_RESOURCE->CONSTRUCTOR
* +-------------------------------------------------------------------------------------------------+
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD constructor.

    DATA : ls_personne TYPE ty_s_personne.

    "Initialise
    DEFINE add_personne.

      ls_personne-firstname = &1.
      ls_personne-lastname = &2.
      ls_personne-birthdate = &3.
      append ls_personne to me->lt_personnes.
    END-OF-DEFINITION.

    super->constructor( ).

    add_personne 'Princis' 'RAKOTOMANGA' '14/09/1989'.

  ENDMETHOD.                    "constructor


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZPRAXXCL_PERSONNES_RESOURCE->CREATE_PERSONNE
* +-------------------------------------------------------------------------------------------------+
* | [--->] IS_OUT_PERSONNE                TYPE        TY_S_PERSONNE
* | [<-()] OV_PERSONNE_ID                 TYPE        UUID
* | [!CX!] CX_STATIC_CHECK
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD create_personne.

    DATA : ls_in_personne TYPE zta_personne,
           lo_exception   TYPE REF TO cx_root.

    TRY.
        ls_in_personne = map_out_2_in( is_out_personne ).

        ls_in_personne-id = cl_system_uuid=>create_uuid_x16_static( ).

        INSERT INTO zta_personne VALUES ls_in_personne.
        IF sy-subrc IS INITIAL.
          CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'.

          ov_personne_id = ls_in_personne-id.

        ELSE.
          RAISE EXCEPTION TYPE cx_abap_invalid_value
            EXPORTING
              value = 'Error on Creating a Person'.
        ENDIF.

      CATCH  cx_root INTO lo_exception.
        CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.

        RAISE EXCEPTION lo_exception.

    ENDTRY.




  ENDMETHOD.                    "create_personne


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZPRAXXCL_PERSONNES_RESOURCE->GET_LIST_PERSONNES
* +-------------------------------------------------------------------------------------------------+
* | [<-()] OT_LIST_PERSONNES              TYPE        TY_T_PERSONNE
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_list_personnes.

    DATA : lt_in_personnes TYPE STANDARD TABLE OF zta_personne.
    FIELD-SYMBOLS :
    <ls_in_personne> LIKE LINE OF lt_in_personnes,
    <ls_out_personne> LIKE LINE OF ot_list_personnes.

    REFRESH : ot_list_personnes.

    "Consider this is a Service Class
    SELECT * FROM zta_personne INTO TABLE lt_in_personnes.
    IF sy-subrc IS INITIAL.
      LOOP AT lt_in_personnes ASSIGNING <ls_in_personne>.
        APPEND INITIAL LINE TO ot_list_personnes ASSIGNING <ls_out_personne>.
        <ls_out_personne> = map_in_2_out( <ls_in_personne> ).
      ENDLOOP.
    ENDIF.






  ENDMETHOD.                    "get_list_personnes


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZPRAXXCL_PERSONNES_RESOURCE->GET_PERSONNE_BY_ID
* +-------------------------------------------------------------------------------------------------+
* | [--->] IV_PERSONNE_ID                 TYPE        STRING
* | [<-()] OS_OUT_PERSONNE                TYPE        TY_S_PERSONNE
* | [!CX!] CX_STATIC_CHECK
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD get_personne_by_id.

    DATA :
    lv_in_personne_id TYPE zta_personne-id,
    ls_in_personne  TYPE zta_personne.

    lv_in_personne_id = iv_personne_id.

    SELECT SINGLE * FROM  zta_personne
      INTO ls_in_personne
      WHERE id = lv_in_personne_id.
    IF sy-subrc IS INITIAL.

      os_out_personne = map_in_2_out( ls_in_personne ).

    ENDIF.

  ENDMETHOD.                    "get_personne_by_id


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZPRAXXCL_PERSONNES_RESOURCE->IF_REST_RESOURCE~GET
* +-------------------------------------------------------------------------------------------------+
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD if_rest_resource~get.

    DATA :
    lv_person_id TYPE string,
    lo_exception  TYPE REF TO cx_root.

    TRY.

        "Considering : /sap/bc/rest/personnes/{personId}
        lv_person_id = mo_request->get_uri_attribute( 'personId' ).

        IF lv_person_id IS NOT INITIAL.

          mo_response->create_entity( )->set_string_data( /ui2/cl_json=>serialize(
            data        = me->get_personne_by_id( lv_person_id )
            compress    = abap_true
            pretty_name = /ui2/cl_json=>pretty_mode-camel_case
            ) ).


        ELSE.

          mo_response->create_entity( )->set_string_data( /ui2/cl_json=>serialize(
            data        = me->get_list_personnes( )
            compress    = abap_true
            pretty_name = /ui2/cl_json=>pretty_mode-camel_case
            ) ).

        ENDIF.

        mo_response->get_entity( )->set_content_type( iv_media_type = if_rest_media_type=>gc_appl_json ).
      CATCH cx_root INTO lo_exception.
        raise_exception( lo_exception->get_text( ) ).
    ENDTRY.


  ENDMETHOD.                    "if_rest_resource~get


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Public Method ZPRAXXCL_PERSONNES_RESOURCE->IF_REST_RESOURCE~POST
* +-------------------------------------------------------------------------------------------------+
* | [--->] IO_ENTITY                      TYPE REF TO IF_REST_ENTITY
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD if_rest_resource~post.

    DATA :
    lo_exception        TYPE REF TO cx_root,
    ls_out_personne     TYPE ty_s_personne,
    lo_response_entity  TYPE REF TO if_rest_entity.

    TRY.

        /ui2/cl_json=>deserialize(
          EXPORTING
            json        = io_entity->get_string_data( )
            pretty_name = /ui2/cl_json=>pretty_mode-camel_case
          CHANGING
            data        = ls_out_personne
        ).


        ls_out_personne-id = create_personne( ls_out_personne ).

        lo_response_entity = mo_response->create_entity( ).
        lo_response_entity->set_string_data( /ui2/cl_json=>serialize( data = ls_out_personne compress = abap_true pretty_name = /ui2/cl_json=>pretty_mode-camel_case ) ).
        lo_response_entity->set_content_type( if_rest_media_type=>gc_appl_json ).

      CATCH cx_root INTO lo_exception.

        raise_exception( lo_exception->get_text( ) ).

    ENDTRY.

  ENDMETHOD.                    "if_rest_resource~post


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZPRAXXCL_PERSONNES_RESOURCE->MAP_IN_2_OUT
* +-------------------------------------------------------------------------------------------------+
* | [--->] IS_IN_PERSONNE                 TYPE        ZTA_PERSONNE
* | [<-()] OS_OUT_PERSONNE                TYPE        TY_S_PERSONNE
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD map_in_2_out.

    CLEAR : os_out_personne.
    os_out_personne-birthdate = is_in_personne-birthdate.
    os_out_personne-firstname = is_in_personne-prenom.
    os_out_personne-lastname  = is_in_personne-nom.
    os_out_personne-id        = is_in_personne-id.



  ENDMETHOD.                    "map_in_2_out


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZPRAXXCL_PERSONNES_RESOURCE->MAP_OUT_2_IN
* +-------------------------------------------------------------------------------------------------+
* | [--->] IS_OUT_PERSONNE                TYPE        TY_S_PERSONNE
* | [<-()] OS_IN_PERSONNE                 TYPE        ZTA_PERSONNE
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD map_out_2_in.

    CLEAR : os_in_personne.
    os_in_personne-birthdate  = is_out_personne-birthdate.
    os_in_personne-nom        = is_out_personne-lastname.
    os_in_personne-prenom     = is_out_personne-firstname.
    os_in_personne-id     = is_out_personne-id.


  ENDMETHOD.                    "map_out_2_in


* <SIGNATURE>---------------------------------------------------------------------------------------+
* | Instance Private Method ZPRAXXCL_PERSONNES_RESOURCE->RAISE_EXCEPTION
* +-------------------------------------------------------------------------------------------------+
* | [--->] IO_DATA                        TYPE        ANY
* +--------------------------------------------------------------------------------------</SIGNATURE>
  METHOD raise_exception.

    DATA :
    ls_error            TYPE ty_s_error,
    lo_entity_provider  TYPE REF TO cl_rest_entity_provider,
    lo_entity           TYPE REF TO if_rest_entity.


    CLEAR : lo_entity_provider, lo_entity.
    lo_entity = mo_response->get_entity( ).
    IF lo_entity IS INITIAL.
      lo_entity = mo_response->create_entity( ).
    ENDIF.
    ls_error-message = io_data.
    lo_entity->set_string_data(
      /ui2/cl_json=>serialize(
          data        = ls_error
          compress    = abap_true
          pretty_name = /ui2/cl_json=>pretty_mode-camel_case
      ) ).

    lo_entity->set_content_type( if_rest_media_type=>gc_appl_json ).

    CREATE OBJECT lo_entity_provider TYPE lcl_my_entity_provider
      EXPORTING
        io_entity = lo_entity.

    RAISE EXCEPTION TYPE cx_rest_resource_exception
      EXPORTING
        entity_provider = lo_entity_provider
        request_method  = mo_request->get_method( ).


  ENDMETHOD.                    "raise_exception
ENDCLASS.
