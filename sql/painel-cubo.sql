/*polo-cubo v4 · de 2026-01-01 até D-1*/
WITH
d0 AS (
  SELECT Data, CodigoCliente, EtapaAcaoId, nome_usuario, veiculocaptacao_dn, bairro_imovel, categoria_imovel, dormitorios_imovel, areaprivativa_imovel
  FROM `vistaprocessos.nitro_dados.vw_consolidado_dados_polo`
  WHERE Data BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
    AND (Assunto IS NULL OR Assunto NOT IN ('Negócio ganho','Negócio perdido'))
    AND EtapaAcaoId IN ('9','17','13','16','14','2','7')
),
g0 AS (
  SELECT CodigoNegocio, MIN(Data) d, ANY_VALUE(CodigoEmImovel) imo, MAX(valornegocio_dn) val,
    ANY_VALUE(veiculocaptacao_dn) vei, ANY_VALUE(bairro_imovel) bai, ANY_VALUE(categoria_imovel) cat,
    ANY_VALUE(dormitorios_imovel) dor, ANY_VALUE(areaprivativa_imovel) are, ARRAY_AGG(DISTINCT IFNULL(nome_usuario,'')) cors
  FROM `vistaprocessos.nitro_dados.vw_consolidado_dados_polo`
  WHERE Assunto IN ('Negócio ganho', 'Negocio Ganho via API') AND Data BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
  GROUP BY 1
),
u AS (SELECT codigo, ANY_VALUE(nome) nome FROM `vistaprocessos.nitro_dados.vista_usuarios` WHERE imobiliaria_id = 1005 GROUP BY 1),
i0 AS (
  SELECT codigo, ANY_VALUE(DATE(data_cadastro)) d, ANY_VALUE(tem_placa) pl, ANY_VALUE(codigo_corretor) cc,
    ANY_VALUE(bairro) bai, ANY_VALUE(categoria) cat, ANY_VALUE(dormitorios) dor, ANY_VALUE(SAFE_CAST(area_privativa AS FLOAT64)) are
  FROM `vistaprocessos.nitro_dados.vista_imoveis` WHERE imobiliaria_id = 1005 GROUP BY 1
),
base AS (
  SELECT DISTINCT 0 m, DATE(Data) d, CodigoCliente x, nome_usuario cor, veiculocaptacao_dn vei, bairro_imovel bai, categoria_imovel cat,
    Dormitorios dor, CAST(ROUND(SAFE_CAST(AreaPrivativa AS FLOAT64)) AS INT64) are, CAST(NULL AS STRING) imo, CAST(NULL AS INT64) val
  FROM `vistaprocessos.nitro_dados.vw_consolidado_clientes_capturados_polo`
  WHERE DATE(Data) BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
  UNION DISTINCT
  SELECT CASE EtapaAcaoId WHEN '9' THEN 1 WHEN '17' THEN 2 WHEN '13' THEN 3 WHEN '16' THEN 3 WHEN '14' THEN 4 WHEN '2' THEN 5 ELSE 6 END,
    Data, CodigoCliente, nome_usuario, veiculocaptacao_dn, bairro_imovel, categoria_imovel, dormitorios_imovel,
    CAST(ROUND(areaprivativa_imovel) AS INT64), NULL, NULL
  FROM d0
  UNION DISTINCT
  SELECT 7, d, CodigoNegocio, NULLIF(c,''), vei, bai, cat, dor, CAST(ROUND(are) AS INT64), imo, CAST(ROUND(val) AS INT64)
  FROM g0, UNNEST(cors) c
  UNION DISTINCT
  SELECT m, i0.d, i0.codigo, u.nome, NULL, bai, cat, dor, CAST(ROUND(are) AS INT64), NULL, NULL
  FROM i0 LEFT JOIN u ON u.codigo = i0.cc, UNNEST(IF(LOWER(pl) = 'sim', [8, 9], [8])) m
  WHERE i0.d BETWEEN '2026-01-01' AND DATE_SUB(CURRENT_DATE('America/Sao_Paulo'), INTERVAL 1 DAY)
),
k AS (
  SELECT 'cor' t, cor v FROM base WHERE cor IS NOT NULL GROUP BY 2 UNION ALL
  SELECT 'vei', vei FROM base WHERE vei IS NOT NULL GROUP BY 2 UNION ALL
  SELECT 'bai', bai FROM base WHERE bai IS NOT NULL GROUP BY 2 UNION ALL
  SELECT 'cat', cat FROM base WHERE cat IS NOT NULL GROUP BY 2
),
kd AS (SELECT t, v, ROW_NUMBER() OVER (PARTITION BY t ORDER BY v) id FROM k),
enc AS (
  SELECT b.m, b.d,
    CONCAT(DATE_DIFF(b.d, DATE '2025-01-01', DAY), '|', IFNULL(b.x,''), '|', IFNULL(CAST(k1.id AS STRING),''), '|', IFNULL(CAST(k2.id AS STRING),''), '|',
      IFNULL(CAST(k3.id AS STRING),''), '|', IFNULL(CAST(k4.id AS STRING),''), '|', IFNULL(CAST(b.dor AS STRING),''), '|', IFNULL(CAST(b.are AS STRING),''), '|',
      IFNULL(b.imo,''), '|', IFNULL(CAST(b.val AS STRING),'')) r
  FROM base b
  LEFT JOIN kd k1 ON k1.t = 'cor' AND k1.v = b.cor
  LEFT JOIN kd k2 ON k2.t = 'vei' AND k2.v = b.vei
  LEFT JOIN kd k3 ON k3.t = 'bai' AND k3.v = b.bai
  LEFT JOIN kd k4 ON k4.t = 'cat' AND k4.v = b.cat
)
SELECT CONCAT('m', CAST(m AS STRING)) k, COUNT(*) n, STRING_AGG(r, ';' ORDER BY d) s FROM enc GROUP BY m
UNION ALL
SELECT CONCAT('k_', t), COUNT(*), STRING_AGG(v, '\t' ORDER BY id) FROM kd GROUP BY t
UNION ALL
SELECT 'ref', 0, CAST(CURRENT_DATE('America/Sao_Paulo') AS STRING)
